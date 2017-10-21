class WebDesktop extends window.HTMLElement {
  constructor () {
    super()
    this._apps = new Array(0)
    this.createdCallback()
  }

  /**
   * This method is supposed to be called when the element is created, but
   * it is only called when using 'document.registerElement()', and not when
   * using 'window.customElements.define'. I called it in the constructor anyway
   */
  createdCallback () {
    // Here, we build the shadow and its CSS (it seems every shadow needs it's own CSS)
    let tmpStyle = document.createElement('link')
    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/WebDesktop.css')
    this._shadow = this.attachShadow({mode: 'open'})
    this._deskTop = document.createElement('main')
    this._deskTop.classList.add('desk-top')
    this._deskBar = document.createElement('footer')
    this._deskBar.classList.add('desk-bar')
    this._shadow.appendChild(tmpStyle)
    this._shadow.appendChild(this._deskTop)
    this._shadow.appendChild(this._deskBar)
    this._WindowClass = require('./AppWindow')
    this._prepareEvents()
    this._attachEvents()
  }

  /**
   * Prepares the desktop's events needed (intended as private)
   */
  _prepareEvents () {
    this._eventBarClickHandler = ev => {
      switch (ev.target.tagName) {
        case 'A':
          let tmpWin = new this._WindowClass(ev.target.ApplicationClass.appName)
          let TmpApp = ev.target.ApplicationClass
          tmpWin.windowApp = new TmpApp()
          this._deskTop.appendChild(tmpWin)
          tmpWin.changeSize(TmpApp.defaultAppSize)
          break
      }
    }
    this._eventTopClickHandler = ev => { // Here, due to the shadow-dom, I couldn't use ev.target as expected (luckily I found this solution)
      if (ev.target.tagName === 'A') {
        if (ev.target.classList.contains('app-win-close')) {
          this._deskTop.removeChild(ev.path[4]) // The fourth parent
        } else if (ev.target.classList.contains('app-win-max')) { // Hope I can continue these
        } else if (ev.target.classList.contains('app-win-min')) {
        }
      }
    }
    this._eventTopMouseDownHandler = ev => {
      // let tmpElem = ev.path[0]
      if (ev.target.tagName === 'DIV') {
        this._tempMoved = ev.target.parentNode
        if (!this._tempMoved.style.left) {
          this._tempMoved.style.left = '0px'
        }
        if (!this._tempMoved.style.top) {
          this._tempMoved.style.top = '55px'
        }
        this._moveXdif = ev.clientX - parseInt(this._tempMoved.style.left, 10)
        this._moveYdif = ev.clientY - parseInt(this._tempMoved.style.top, 10)
        this._tempMoved.style.opacity = 0.5
        // document.addEventListener('mousemove', this._eventDocMouseMoveHandler)
        this._deskTop.addEventListener('mousemove', this._eventTopMouseMoveHandler) // This is betterto let the '_deskTop' handle it
        document.addEventListener('mouseup', this._eventDocMouseUpHandler)
      }
    }
    this._eventTopMouseMoveHandler = ev => {
      if (this._tempMoved) {
        this._tempMoved.style.left = (ev.clientX - this._moveXdif) + 'px'
        this._tempMoved.style.top = (ev.clientY - this._moveYdif) + 'px'
      }
    }
    this._eventDocMouseUpHandler = ev => {
      if (this._tempMoved) {
        // document.removeEventListener('mousemove', this._eventDocMouseMoveHandler)
        this._deskTop.addEventListener('mousemove', this._eventTopMouseMoveHandler)
        document.removeEventListener('mouseup', this._eventDocMouseUpHandler)
        this._tempMoved.style.opacity = 1
        this._moveXdif = 0
        this._moveYdif = 0
        this._tempMoved = null
      }
    }
  }

  /**
   * Attach the desktop's events.
   */
  _attachEvents () {
    // My idea was to let every window handle its own events, but after watching one of the course's
    // videos, it seems that dispaching the event and handle it here is better (while letting the window
    // handle it seems more organized)
    this._deskBar.addEventListener('click', this._eventBarClickHandler)
    this._deskTop.addEventListener('click', this._eventTopClickHandler)
    this._deskTop.addEventListener('mousedown', this._eventTopMouseDownHandler)
  }

  /**
   * Adds an app to put inside the window.
   * @param {*} AppClass the class for the application to be put in the window
   */
  addApp (AppClass) {
    let tmpIcon = document.createElement('a')
    // tmpIcon.setAttribute('href', '#app' + this._apps.length)
    tmpIcon.setAttribute('href', 'javascript:')
    tmpIcon.classList.add('desk-icon')
    tmpIcon.style.backgroundImage = 'url("' + AppClass.appIconURL + '")'
    tmpIcon['ApplicationClass'] = AppClass
    this._apps.push(tmpIcon)
    this._deskBar.appendChild(tmpIcon) // TODO: May Remove
  }
}

window.customElements.define('my-web-desktop', WebDesktop)

module.exports = WebDesktop
