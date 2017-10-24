const THE_APP_ICON = '/image/chat-app-icon.png'
const THE_APP_NAME = 'Chat Application'
const THE_CHAT_SECURE_SERVER = 'wss://azmat.se:443/testtest/'
// const THE_CHAT_SERVER = 'ws://vhost3.lnu.se:20080/socket/'
const THE_CHAT_PROTS = 'secure'
const THE_CHAT_API_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
const THE_CHAT_CHANNEL = 'secure'
const THE_CHAT_HIST_LIMIT = 30
const THE_STORAGE_HIST_KEY = 'CHAT_HIST'
const THE_STORAGE_USER_KEY = 'CHAT_USER'
const THE_IS_BASE64_ENC = false

class ChatApp extends window.HTMLElement {
  constructor () {
    super()
    if ((this._userName = window.localStorage.getItem(THE_STORAGE_USER_KEY))) {
      this._chatRecord = JSON.parse(window.localStorage.getItem(THE_STORAGE_HIST_KEY))
    } else {
      this._chatRecord = new Array(0)
      this._userName = ''
      window.localStorage.setItem(THE_STORAGE_HIST_KEY, '[]')
      window.localStorage.setItem(THE_STORAGE_USER_KEY, '')
    }
    this._isNewChat = true // Used to specify the first send
    this.createdCallback()
  }

  createdCallback () {
    this._CommClass = require('./CommSock')
    this._srvCom = new this._CommClass(THE_CHAT_SECURE_SERVER, THE_CHAT_PROTS)
    let tmpStyle = document.createElement('link')
    let tmpLink = document.head.querySelector('link[rel="import"][href="/imports/ChatApp.html"]')
    this._shadow = this.attachShadow({mode: 'open'})

    this._srvCom.onMessageReceived = this._msgReceivedHandler.bind(this)
    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/ChatApp.css')
    this._shadow.appendChild(tmpStyle)
    let tmpConstWin = () => { // Used to construct the window
      this._chatBubbleToBeCloned = tmpLink.import.querySelector('div.chat-bubble')
      this._chatWindow = tmpLink.import.querySelector('form.chat-window').cloneNode(true)
      this._chatHistory = this._chatWindow.querySelector('div.chat-window-history')
      this._chatTextBox = this._chatWindow.querySelector('textarea.chat-window-textbox')
      this._chatBut = this._chatWindow.querySelector('input.chat-window-button')
      this._shadow.appendChild(this._chatWindow)

      this._chatWindow.addEventListener('submit', ev => {
        ev.preventDefault()
        this._sendChat()
      })
      this._chatTextBox.addEventListener('keypress', ev => {
        if (ev.keyCode === 13) {
          ev.preventDefault()
          this._sendChat()
        }
      })
      this._chatHistory.appendChild(this._createChatBubble('Starting a new chat', 'Please enter the user name for the chat.'))
      this._chatTextBox.value = this._userName
    }
    if (tmpLink) { // Check if the link is already on the page
      tmpConstWin()
    } else {
      tmpLink = document.createElement('link')
      tmpLink.setAttribute('rel', 'import')
      tmpLink.setAttribute('href', '/imports/ChatApp.html')
      document.head.appendChild(tmpLink)
      tmpLink.addEventListener('load', tmpConstWin)
    }
  }

  /**
   * Used to send the textarea content to the chat server
   */
  _sendChat () {
    if (this._chatTextBox.value) {
      if (this._isNewChat) { // Used to check if the user is logged in to chat yet or not
        this._userName = this._chatTextBox.value
        window.localStorage.setItem(THE_STORAGE_USER_KEY, this._chatTextBox.value)
        this._chatHistory.removeChild(this._chatHistory.firstElementChild)
        for (let i = 0; i < this._chatRecord.length; i++) {
          this._chatHistory.appendChild(this._createChatBubble(this._chatRecord[i].username + ' wrote:', this._chatRecord[i].data, this._chatRecord[i].username === this._userName))
        }
        this._srvCom.sendData(this._MessageFactory(this._userName + ' joined the chat'))
        this._isNewChat = false
      } else {
        if (THE_IS_BASE64_ENC) {
          this._chatTextBox.value = window.btoa(this._chatTextBox.value)
        }
        this._srvCom.sendData(this._MessageFactory(this._chatTextBox.value))
      }
      this._chatTextBox.value = ''
    }
  }

  _createChatBubble (theHeadline, theText, isRight) {
    let outBubble = this._chatBubbleToBeCloned.cloneNode(true)
    outBubble.querySelector('h6.chat-bubble-head').textContent = theHeadline
    outBubble.querySelector('p.chat-bubble-message').textContent = theText
    outBubble.classList.add(isRight ? 'chat-arrow-right' : 'chat-arrow-left')
    return outBubble
  }

  /**
   * A factory for message objects to send to server
   * @param {*} theMsg
   */
  _MessageFactory (theMsg) {
    return {
      type: 'message',
      data: theMsg,
      username: this._userName,
      channel: THE_CHAT_CHANNEL,
      key: THE_CHAT_API_KEY
    }
  }

  /**
   * A handler for the web socket 'message' event
   * @param {*} theEvent the web socket event
   */
  _msgReceivedHandler (theEvent) {
    let tmpData = JSON.parse(theEvent.data)
    switch (tmpData.type) {
      case 'message':
        this._chatHistory.appendChild(this._createChatBubble(tmpData.username + ' wrote:', tmpData.data, tmpData.username === this._userName))
        this._addToChatHistory(tmpData)
        this._chatHistory.scrollTop = this._chatHistory.scrollHeight
        break
      case 'notification':
        break
      case 'heartbeat':
    }
  }

  _addToChatHistory (theMsg) {
    this._chatRecord.push(theMsg)
    if (this._chatRecord.length > THE_CHAT_HIST_LIMIT) {
      this._chatRecord.shift()
      this._chatHistory.removeChild(this._chatHistory.firstElementChild)
    }
    window.localStorage.setItem(THE_STORAGE_HIST_KEY, JSON.stringify(this._chatRecord))
  }

  // From here down is considered the interface for an app //

  /**
   * Ends the application gracefully
   */
  endApp () {
    if (!this._srvCom.isClosed) {
      this._chatTextBox.value = this._userName + ' signing off...'
      this._sendChat()
      this._srvCom.closeConnection()
    }
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
    return {width: 400, height: 320}
  }
}

window.customElements.define('my-chat-app', ChatApp)

module.exports = ChatApp
