const THE_APP_ICON = '/image/chat-app-icon.png'
const THE_APP_NAME = 'Chat Application'

class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    this.createdCallback()
  }

  createdCallback () {
  }

  static get appIconURL () {
    return THE_APP_ICON
  }

  static get appName () {
    return THE_APP_NAME
  }

  static get defaultAppSize () {
    return {width: 320, height: 450}
  }
}

window.customElements.define('my-chat-app', ChatApp)

module.exports = ChatApp
