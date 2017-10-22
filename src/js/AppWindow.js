// I canceled the use of Shadow DOM here (but it is still used in 'WebDesktop.js') because it
// caused me many limitations when dealing with events. I tried using 'event.path[]' but there
// are still many constrictions due to Shadow DOM features (but I learned more about it anyway)

/**
 * A class that represents a window that can contain an application
 */
class AppWindow extends window.HTMLElement {
  constructor (theTitle) {
    super()
    if (theTitle) {
      this._title = theTitle
    }
    this.createdCallback()
  }

  createdCallback () {
    let tmpStyle = document.querySelector('link[rel="stylesheet"][href="/css/AppWindow.css"]')
    if (!tmpStyle) {
      tmpStyle = document.createElement('link')
      tmpStyle.setAttribute('rel', 'stylesheet')
      tmpStyle.setAttribute('href', '/css/AppWindow.css')
      // this._shadow = this.attachShadow({mode: 'open'})
      // this._shadow.appendChild(tmpStyle)
      this.appendChild(tmpStyle)
    }
    this._importHtml()
  }

  _importHtml () {
    let tmpLink = document.head.querySelector('link[rel="import"][href="/imports/AppWindow.html"]')
    let tmpConstWin = () => {
      this._windowOuter = tmpLink.import.querySelector('div.app-win').cloneNode(true)
      this._windowBar = this._windowOuter.querySelector('div.app-win-bar')
      this._windowTitle = this._windowOuter.querySelector('div.app-win-title')
      this._windowButMin = this._windowOuter.querySelector('a.app-win-min')
      this._windowButMax = this._windowOuter.querySelector('a.app-win-max')
      this._windowButClose = this._windowOuter.querySelector('a.app-win-close')
      this._windowInner = this._windowOuter.querySelector('div.app-win-content')
      this._windowIcon = this._windowOuter.querySelector('img.app-win-icon')
      if (this._winApp) {
        this.windowApp = this._winApp
      }
      if (this._title) {
        this.windowTitle = this._title
      }
      if (this._tempNewSize) {
        this._windowInner.style.width = this._tempNewSize.width + 'px'
        this._windowInner.style.height = this._tempNewSize.height + 'px'
        this._tempNewSize = null
      }
      // this._shadow.appendChild(this._windowOuter)
      this.appendChild(this._windowOuter)
    }
    if (tmpLink) {
      tmpConstWin()
    } else {
      tmpLink = document.createElement('link')
      tmpLink.setAttribute('rel', 'import')
      tmpLink.setAttribute('href', '/imports/AppWindow.html')
      document.head.appendChild(tmpLink)
      tmpLink.addEventListener('load', tmpConstWin)
    }
  }

  /**
   * Force a change of the window size.
   * @param {*} newSizeObj an object with new size data: '{width: 300, height: 300}'
   */
  changeSize (newSizeObj) {
    if (this._windowInner) {
      this._windowInner.style.width = newSizeObj.width + 'px'
      this._windowInner.style.height = newSizeObj.height + 'px'
    } else {
      this._tempNewSize = newSizeObj
    }
  }

  /**
   * The inside application.
   */
  get windowApp () {
    return this._winApp
  }

  /**
   * The inside application.
   */
  set windowApp (winApp) {
    this._winApp = winApp
    if (this._windowInner) {
      if (this._windowInner.firstElementChild && this._windowInner.firstElementChild !== winApp) {
        this.windowTitle = winApp.constructor.appName
        this._windowIcon.setAttribute('src', winApp.constructor.appIconURL)
        this._windowInner.replaceChild(winApp, this._windowInner.firstElementChild)
      } else if (!this._windowInner.firstElementChild) {
        this.windowTitle = winApp.constructor.appName
        this._windowIcon.setAttribute('src', winApp.constructor.appIconURL)
        this._windowInner.appendChild(winApp)
      }
    }
  }

  /**
   * The window's title.
   */
  get windowTitle () {
    return this._windowTitle.textContent
  }

  /**
   * The window's title.
   */
  set windowTitle (newTitle) {
    this._windowTitle.textContent = newTitle
  }

  /**
   * Specifies if the window is the active on-top window.
   */
  get isActive () {
    return !this._windowOuter.classList.contains('app-inactive')
  }

  /**
   * Specifies if the window is the active on-top window.
   */
  set isActive (newIsActive) {
    if (newIsActive) {
      this._windowOuter.classList.remove('app-inactive')
    } else {
      this._windowOuter.classList.add('app-inactive')
    }
  }

  /**
   * Specifies if the window is transparent (can be set when moving).
   */
  get isTransparent () {
    return this._windowOuter.classList.contains('app-transp')
  }

  /**
   * Specifies if the window is transparent (can be set when moving).
   */
  set isTransparent (newIsTransparent) {
    if (newIsTransparent) {
      this._windowOuter.classList.add('app-transp')
    } else {
      this._windowOuter.classList.remove('app-transp')
    }
  }
}

window.customElements.define('my-app-window', AppWindow)

module.exports = AppWindow
