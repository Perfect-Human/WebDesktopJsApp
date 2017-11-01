const THE_APP_ICON = '/image/interm-app-icon.png'
const THE_APP_NAME = 'Interminator Explorer'

class InterminatorApp extends window.HTMLElement {
  constructor () {
    super()
    this.createdCallback()
  }

  createdCallback () {
    let tmpStyle = document.createElement('link')
    let tmpLinkBar = document.createElement('input')
    this._frame = document.createElement('iframe')
    this._frame.classList.add('interm-frame')
    this._frame.setAttribute('src', 'http://lnu.se')

    if (!this._shadow) this._shadow = this.attachShadow({mode: 'open'})

    tmpStyle = document.createElement('link')
    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/InterminatorApp.css')
    this._shadow.appendChild(tmpStyle)
    tmpLinkBar.classList.add('interm-link-bar')
    tmpLinkBar.value = 'http://lnu.se'
    tmpLinkBar.addEventListener('keypress', ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault()
        if (this._frame) this._shadow.removeChild(this._frame)
        this._frame = document.createElement('iframe')
        if (!tmpLinkBar.value.startsWith('http://') && !tmpLinkBar.value.startsWith('https://')) {
          tmpLinkBar.value = 'http://' + tmpLinkBar.value
        }
        this._frame.classList.add('interm-frame')
        this._frame.setAttribute('src', tmpLinkBar.value)
        this._shadow.appendChild(this._frame)
      }
    })
    this._shadow.appendChild(tmpLinkBar)
    this._shadow.appendChild(this._frame)
  }

  // From here down is considered the interface for an app //

  /**
   * Ends the application gracefully
   */
  endApp () {
  }

  /**
   * Specifies the app icon's URL (static)
   */
  static get appIconURL () {
    return THE_APP_ICON
  }

  /**
   * Specifies the app name (static)
   */
  static get appName () {
    return THE_APP_NAME
  }

  /**
   * Specifies the app's default/initial size (static)
   */
  static get defaultAppSize () {
    return {width: 640, height: 480}
  }
}

window.customElements.define('my-interm-app', InterminatorApp)

module.exports = InterminatorApp
