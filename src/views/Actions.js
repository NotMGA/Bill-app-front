import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
      <div id="download" data-testid="icon-download" data-bill-url=${billUrl}>
      <a id="download_link" download hidden></a>
      ${downloadBlueIcon}
      </div>
    </div>`
  )
}