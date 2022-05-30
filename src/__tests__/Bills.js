/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES,ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent  from "@testing-library/user-event"

import Router from "../app/Router.js"
import Bills from "../containers/Bills.js";
import store from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

 test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      Object.defineProperty(window, "location", {
        value: {
          hash: ROUTES_PATH["Bills"]
        }
      })

      document.body.innerHTML = `<div id="root"></div>`
      Router()
      const icon = screen.getByTestId('icon-window')

      expect(icon.classList.contains("active-icon")).toBeTruthy()
      
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)

    })
     test("Should give me Loading Page if loading is true", () => {
      const html = BillsUI({ data: bills, loading: true })
      document.body.innerHTML = html
      expect(screen.getByTestId("loading_test")).toBeTruthy()
    })
    test("Should give me error Page if loading is not defined ", () => {
      const html = BillsUI({ data: bills, error: true })
      document.body.innerHTML = html
      expect(screen.queryByTestId("error-message")).toBeTruthy()

    })

 test('Should give the good url when you press the button new Bills', () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      // on simule un localstorage
      Object.defineProperty(window, "localStorage", {
        value: { getItem: jest.fn(() => null), setItem: jest.fn(() => null) },
        writable: true
      })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };
      const firebase = jest.fn()
      const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })

      const handleClickNewBill = jest.fn(bill.handleClickNewBill);

      const btnNewBill = screen.getByTestId(`btn-new-bill`)
      btnNewBill.addEventListener("click", handleClickNewBill)

      fireEvent.click(btnNewBill)

      expect(handleClickNewBill).toHaveBeenCalled();
      expect(window.location.hash).toBe(ROUTES_PATH["Bills"]);

    })
    test('Should open modal when i click on que IconEye', () => {
      $.fn.modal = jest.fn()
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      Object.defineProperty(window, "localStorage", { value: { getItem: jest.fn(() => null), setItem: jest.fn(() => null) } },
      )

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };
      const firebase = jest.fn()
      const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })

      const handleClickIconEye = jest.fn(bill.handleClickIconEye);

      const iconsEye = screen.getAllByTestId(`icon-eye`)
      const firstEye = iconsEye[0]
      firstEye.addEventListener("click", handleClickIconEye(firstEye))
      userEvent.click(firstEye)

      expect(handleClickIconEye).toHaveBeenCalled()
      expect($.fn.modal).toHaveBeenCalled()

    })

    test('Should download file when i click on icon download', () => {
      $.fn.modal = jest.fn()
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      Object.defineProperty(window, "localStorage", { value: { getItem: jest.fn(() => null), setItem: jest.fn(() => null) } },
      )

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };
      const firebase = jest.fn()
      const bill = new Bills({ document, onNavigate, firebase, localStorage: window.localStorage })

      const handleClickIconDownload = jest.fn(bill.handleClickIconDownload);

      const iconsDownload = screen.getAllByTestId(`icon-download`)
      const firstDOwnload = iconsDownload[0]
      firstDOwnload.addEventListener("click", handleClickIconDownload(firstDOwnload))
      userEvent.click(firstDOwnload)

      expect(handleClickIconDownload).toHaveBeenCalled()

    })

    test('Should display the new bill button', () => {

      const html = BillsUI({ data: [] })
      document.body.innerHTML = html

      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()


    });


  });  });



 
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
  
    test("then bills from an API and fails with 404 message error", async () => {
      store.bills(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();

    });
    test("then messages from an API and fails with 500 message error", async () => {
      store.bills(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const MyMessage = await screen.getByText(/Erreur 500/);
      expect(MyMessage).toBeTruthy();

    });
  });
});


