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
  }

  /**
   * Prepares the desktop's events needed (intended as private)
   */
  _prepareEvents () {
    // My idea was to let every window handle its own events, but after watching one of the course's
    // videos, it seems that dispaching the event and handle it here is better (while letting the window
    // handle it seems more organized)
    this._deskBar.addEventListener('click', ev => {
      switch (ev.target.tagName) {
        case 'A':
          let tmpWin = new this._WindowClass(ev.target.ApplicationClass.appName)
          let TmpApp = ev.target.ApplicationClass
          tmpWin.windowApp = new TmpApp()
          this._deskTop.appendChild(tmpWin)
          tmpWin.changeSize(TmpApp.defaultAppSize)
          break
      }
    })
    this._deskTop.addEventListener('click', ev => { // Here, due to the shadow-dom, I couldn't use ev.target as expected (luckily I found this solution)
      let tmpElem = ev.path[0]
      if (tmpElem && tmpElem.tagName === 'A') {
        if (tmpElem.classList.contains('app-win-close')) {
          this._deskTop.removeChild(ev.target)
        } else if (tmpElem.classList.contains('app-win-max')) {
        } else if (tmpElem.classList.contains('app-win-min')) {
        }
      }
      // console.log(ev.path[0].classList.contains('app-win-title'))
      // console.log(ev.path[0])
      // console.log(ev.target.tagName)
    })
    this._deskTop.addEventListener('dragstart', ev => {
      let tmpElem = ev.path[0]
      if (tmpElem && tmpElem.tagName === 'DIV' && tmpElem.classList.contains('app-win-bar')) {
        console.log(ev.path[0])
        this._moveXdif = parseInt(this._windowOuter.style.left, 10) - ev.clientX
        this._moveXdif = parseInt(this._windowOuter.style.top, 10) - ev.clientY
      }
    })
    // this._deskTop.addEventListener('drop')
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
