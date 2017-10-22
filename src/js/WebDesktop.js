class WebDesktop extends window.HTMLElement {
  constructor () {
    super()
    this._apps = new Array(0)
    this._windows = new Array(0)
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
      if (ev.target.tagName === 'A') {
        let TmpApp = ev.target.ApplicationClass
        // let tmpWin = new this._WindowClass(TmpApp.appName)
        let tmpWin = new this._WindowClass()
        tmpWin.windowApp = new TmpApp()
        this._deskTop.appendChild(tmpWin)
        if (this._windows.length === 0) {
          this._windows.push(tmpWin)
        } else {
          this._putWinOnTop(tmpWin)
        }
        tmpWin.changeSize(TmpApp.defaultAppSize)
      }
    }
    this._eventTopClickHandler = ev => {
      if (ev.target.tagName === 'A') {
        if (ev.target.classList.contains('app-win-close')) {
          this._closeWin(ev.path[4]) // The fourth parent
        } else if (ev.target.classList.contains('app-win-max')) { // Hope I can continue these
        } else if (ev.target.classList.contains('app-win-min')) {
        }
      }
    }
    this._eventTopMouseDownHandler = ev => {
      // let tmpElem = ev.path[0]

      for (let i = 0; i < ev.path.length; i++) {
        if (!ev.path[i].classList) {
          return // If we reach here then no need to handle anymore (the desktop is clicked, and the index is the shadow)
        } else if (ev.path[i].tagName === 'MY-APP-WINDOW') {
          this._putWinOnTop(ev.path[i])
          break
        }
      }
      if (ev.target.tagName === 'DIV' && ev.target.classList.contains('app-win-bar')) {
        // console.log(ev.target)
        this._tempMoved = ev.target.parentNode
        if (!this._tempMoved.style.left) {
          this._tempMoved.style.left = '0px'
        }
        if (!this._tempMoved.style.top) {
          this._tempMoved.style.top = '0px'
        }
        this._moveXdif = ev.clientX - parseInt(this._tempMoved.style.left, 10)
        this._moveYdif = ev.clientY - parseInt(this._tempMoved.style.top, 10)
        this._tempMoved.parentNode.isTransparent = true
        this._deskTop.addEventListener('mousemove', this._eventTopMouseMoveHandler) // It is better to let the '_deskTop' and not the 'document' to handle it
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
        this._deskTop.addEventListener('mousemove', this._eventTopMouseMoveHandler)
        document.removeEventListener('mouseup', this._eventDocMouseUpHandler)
        this._tempMoved.parentNode.isTransparent = false
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
   * Puts a window on top of all other windows (or add it to the other windows and put it on top)
   * @param {*} theWindow the window to be put on top (or added)
   */
  _putWinOnTop (theWindow) {
    let tmpIndex = this._windows.findIndex(elem => elem === theWindow)
    this._windows[this._windows.length - 1].isActive = false
    theWindow.isActive = true
    if (tmpIndex > -1) {
      theWindow.lastElementChild.style.zIndex = this._windows[this._windows.length - 1].lastElementChild.style.zIndex
      for (let i = tmpIndex + 1; i < this._windows.length; i++) {
        this._windows[i].lastElementChild.style.zIndex = parseInt(this._windows[i].lastElementChild.style.zIndex, 10) - 1
      }
      this._windows.sort(this._compareWin)
    } else {
      theWindow.lastElementChild.style.zIndex = 100 + this._windows.length
      this._windows.push(theWindow)
    }
  }

  /**
   * A window comparere used to sort windows.
   * @param {*} win1 first window to compare
   * @param {*} win2 second window to compare
   */
  _compareWin (win1, win2) {
    return parseInt(win1.lastElementChild.style.zIndex, 10) - parseInt(win2.lastElementChild.style.zIndex, 10)
  }

  /**
   * Closes the window.
   * @param {*} theWindow
   */
  _closeWin (theWindow) {
    if (this._windows[this._windows.length - 1] !== theWindow) {
      this._putWinOnTop(theWindow)
    }
    this._windows.pop()
    this._deskTop.removeChild(theWindow)
  }

  /**
   * Adds an app to put inside the window.
   * @param {*} AppClass the class for the application to be put in the window
   */
  addApp (AppClass) {
    let tmpIcon = document.createElement('a')
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
