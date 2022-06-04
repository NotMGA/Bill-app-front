/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent  from "@testing-library/user-event"
import '@testing-library/jest-dom/extend-expect'

import { fireEvent} from "@testing-library/dom"
import store from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage.js"
import {  ROUTES,ROUTES_PATH } from "../constants/routes.js"
import Router from "../app/Router.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    beforeEach(() => {
      const user = JSON.stringify({
        type: "Employee",
        email: "a@a"
      })

      window.localStorage.setItem("user", user)
      

      const pathname = ROUTES_PATH["NewBill"]
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname
        }
      })
      document.body.innerHTML = "<div id='root'></div>"
      Router()
    })


    test("Then I am on the right page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      console.log(NewBill)
    expect(NewBill).toBeTruthy()
    })




 describe("When the image format is accepted", ()=>{
      test('Then the change file fuction is called', ()=>{
         const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ data: [], pathname });
      };
      const newFile = new File([""], "test.jpg", { type: "image/jpg" })
      window.localStorage.setItem('ext', "jpg")
     
      const newBill = new NewBill({ document, onNavigate, store: store, localStorage })
      const changeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId("file")

      file.addEventListener("change", changeFile)
      fireEvent.change(file, {
        target: {
          files: [newFile]
        }
      })
       
      expect(changeFile).toHaveBeenCalled()
      })
     

    })
   
    test('Then the function handleChange File must be called', async () => {

     const html = NewBillUI();
      document.body.innerHTML = html;
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.tld",
          password: "employee",
          status: "connected",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      const changeFile = jest.fn(newBill.handleChangeFile);
      const file = screen.getByTestId("file");
      file.addEventListener("change", changeFile);
      fireEvent.change(file, {
        target: {
          files: [new File([""], "test.jpg", { type: "image/jpg" })],
        },
      });
      expect(changeFile).toHaveBeenCalled();


    })

    describe("When I click on submit button of the form", () => {
      test('It should create a new bill', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const formData = new FormData()
        formData.append('file', 'yes')
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        window.localStorage.setItem('formData', formData)
        const html = NewBillUI()
        document.body.innerHTML = html
        const newBill = new NewBill({
          document,
          onNavigate,
          store:store,
          localStorage: window.localStorage,
        });
        const file = screen.getByTestId("file")
        fireEvent.change(file, {
          target: {
            files: [new File(["test.png"], "test.png", { type: "image/png" })]
          }
        })
        const handleSubmit = jest.fn(() => newBill.handleSubmit)
        const newBillform = screen.getByTestId("form-new-bill")
        newBillform.addEventListener('submit', handleSubmit)
        fireEvent.submit(newBillform)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
    test('The i havec posted a bill from my MockedApi', async () => {
      //Récupéré dans le mock storage
      
      const storedbills = store.bills()
      const myNewBill = storedbills[0]
      const SpyOn = jest.spyOn(store, 'bills')
      await store.bills(myNewBill)
      expect(SpyOn).toHaveBeenCalled()
    })


  })
})
