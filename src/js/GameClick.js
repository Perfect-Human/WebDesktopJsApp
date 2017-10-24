const THE_APP_ICON = '/image/click-game-icon.png'
const THE_APP_NAME = 'Click Game'

class ColorBoard {
  constructor (brickArray, timerNode, outputNode) {
    this.meCOLORS = {GREY: 0, RED: 1, BLUE: 2, YELLOW: 3, 0: 'grey', 1: 'red', 2: 'blue', 3: 'yellow'}
    this.meBricks = brickArray
    this.meTimeDisp = timerNode
    this.meOutput = outputNode
    this.meCounter = 0

    this.meClickHandler = (ev) => {
      let tmpBrick = ev.target
      if (tmpBrick.classList.contains(this.meOutput.innerText)) {
        tmpBrick.classList.remove(this.meOutput.innerText)
        tmpBrick.classList.add(this.meCOLORS[0])
        this.meCounter++
        if (this.meCounter === 3) {
          this.endGame()
        }
      } else {
        this.wrongClick()
      }
      console.log(this.meCounter)
    }
    this.resetGame()
  }

  startGame () {
    this.resetGame()
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        let tmpBrk
        do {
          tmpBrk = this.meBricks[Math.floor(Math.random() * this.meBricks.length)]
        } while (!tmpBrk.classList.contains(this.meCOLORS[0]))
        tmpBrk.classList.remove(this.meCOLORS[0])
        tmpBrk.classList.add(this.meCOLORS[i])
      }
    }
    this.meOutput.innerText = this.meCOLORS[Math.floor(Math.random() * 3) + 1]
    this.meBricks.forEach(brk => brk.addEventListener('click', this.meClickHandler))
    this.meInterval = window.setInterval(() => {
      this.meTime += 0.1
      this.meTimeDisp.innerText = this.meTime.toFixed(1)
    }, 100)
  }

  resetGame () {
    this.meCounter = 0
    this.meTime = 0.0
    window.clearInterval(this.meInterval)
    this.meBricks.forEach(brk => brk.removeEventListener('click', this.meClickHandler))
    this.meBricks.forEach(brk => {
      brk.classList.remove(this.meCOLORS[0], this.meCOLORS[1], this.meCOLORS[2], this.meCOLORS[3])
      brk.classList.add(this.meCOLORS[0])
    })
  }

  endGame () {
    this.meCounter = 0
    window.clearInterval(this.meInterval)
    this.meBricks.forEach(brk => brk.removeEventListener('click', this.meClickHandler))
    this.meBricks.forEach(brk => {
      brk.classList.remove(this.meCOLORS[0], this.meCOLORS[1], this.meCOLORS[2], this.meCOLORS[3])
      brk.classList.add(this.meCOLORS[0])
    })
  }

  wrongClick () {
    this.meTimeDisp.classList.add(this.meCOLORS[1])
    this.meTime += 3.0
    this.meTimeDisp.innerText = this.meTime.toFixed(1)
    window.setTimeout(() => this.meTimeDisp.classList.remove(this.meCOLORS[1]), 400)
  }
}

class GameClick extends window.HTMLElement {
  constructor () {
    super()
    this.createdCallback()
  }

  createdCallback () {
    let tmpStyle = document.createElement('link')
    let tmpLink = document.head.querySelector('link[rel="import"][href="/imports/GameClick.html"]')
    this._shadow = this.attachShadow({mode: 'open'})

    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/GameClick.css')
    this._shadow.appendChild(tmpStyle)

    let tmpConstWin = () => { // Used to construct the window
      let tmpBoard = tmpLink.import.querySelector('#board').cloneNode(true)
      let tmpBrks = tmpBoard.querySelectorAll('div')
      let tmpMsgs = tmpLink.import.querySelector('.messages').cloneNode(true)
      let tmpTime = tmpMsgs.querySelector('#time')
      let tmpColor = document.createElement('span')
      let tmpBut = document.createElement('button')
      this._colBoard = new ColorBoard(tmpBrks, tmpTime, tmpColor)
      tmpBut.innerText = 'Start New Game'
      tmpBut.addEventListener('click', () => this._colBoard.startGame())
      tmpMsgs.querySelector('#colorToClick').appendChild(tmpColor)
      tmpMsgs.appendChild(tmpBut)
      this._shadow.appendChild(tmpMsgs)
      this._shadow.appendChild(tmpBoard)
    }
    if (tmpLink) { // Check if the link is already on the page
      tmpConstWin()
    } else {
      tmpLink = document.createElement('link')
      tmpLink.setAttribute('rel', 'import')
      tmpLink.setAttribute('href', '/imports/GameClick.html')
      document.head.appendChild(tmpLink)
      tmpLink.addEventListener('load', tmpConstWin)
    }
  }

  // From here down is considered the interface for an app //

  /**
   * Ends the application gracefully
   */
  endApp () {
    this._colBoard.endGame()
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
    return {width: 400, height: 425}
  }
}

window.customElements.define('my-click-game', GameClick)

module.exports = GameClick
