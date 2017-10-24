class CommSock {
  constructor (wsURL, wsProt) {
    this._wsURL = wsURL
    this._wsProt = wsProt
    this._dataBuf = new Array(0)
    this._sockSend = () => {
      let tmpCount = this._dataBuf.length
      for (let i = 0; i < tmpCount; i++) {
        this._sock.send(JSON.stringify(this._dataBuf.shift()))
      }
    }
    this._sockCreate = () => {
      if (wsProt) {
        this._sock = new window.WebSocket(this._wsURL, this._wsProt)
      } else {
        this._sock = new window.WebSocket(this._wsURL)
      }
      this._sock.addEventListener('open', this._sockSend)
      if (this._msgReceivedHandler) {
        this._sock.addEventListener('message', this._msgReceivedHandler)
      }
    }
  }

  sendData (theData) {
    this._dataBuf.push(theData)
    if (this._sock && this._sock.readyState === window.WebSocket.OPEN) { // In case the socket is open
      this._sockSend()
    } else if (this._sock && this._sock.readyState === window.WebSocket.CLOSING) { // In case the socket is about to close (but still not)
      this._sock.addEventListener('close', this._sockCreate)
    } else if (!this._sock || this._sock.readyState === window.WebSocket.CLOSED) { // In case the socket is totally closed or not yet created
      this._sockCreate()
    }
    // The left state is when the socket is CONNECTING. In this case, the data will be sent when connected (usinf 'this._dataBuf')
  }

  closeConnection () {
    if (this._sock && this._sock.readyState !== window.WebSocket.CLOSED) {
      this._sock.close(1000, 'Closing normally on request.')
    }
  }

  get onMessageReceived () {
    return this._msgReceivedHandler
  }

  set onMessageReceived (theEventHandler) {
    this._msgReceivedHandler = theEventHandler
    if (this._sock) {
      this._sock.addEventListener('message', theEventHandler)
    }
  }

  /**
   * Check if socket is closed
   */
  get isClosed () {
    return !this._sock || this._sock.readyState === window.WebSocket.CLOSED
  }
}

module.exports = CommSock
