const THE_ERR_TIME = 1000
const THE_CORR_RIME = 300
const THE_APP_ICON = '/image/memory-game-icon.png'
const THE_APP_NAME = 'Memory Game'

class GameMemory extends window.HTMLElement {
  constructor (cardCount) {
    super()
    this.meCardCount = this.meCardCount && Number.isInteger(this.meCardCount) && this.meCardCount > 3 && this.meCardCount < 17 ? this.meCardCount : 8
    this.createdCallback()
  }

  createdCallback () {
    this.meCounter = 0
    this.GameCard = require('./GameCard')
    let tmpStyle = document.createElement('link')
    let tmpLeg = document.createElement('legend')
    if (!this.meShadow) this.meShadow = this.attachShadow({mode: 'open'})
    this.mePlayBoard = document.createElement('fieldset')
    this.meMatchBoard = document.createElement('fieldset')
    this.meScoreBoard = document.createElement('fieldset')

    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/GameMemory.css')
    this.meShadow.appendChild(tmpStyle)
    tmpLeg.innerText = 'Play Board'
    this.mePlayBoard.appendChild(tmpLeg)
    this.mePlayBoard.classList.add(this.meCardCount === 4 ? 'game-board-2' : 'game-board-4')
    tmpLeg = document.createElement('legend')
    tmpLeg.innerText = 'Match Board'
    this.meMatchBoard.appendChild(tmpLeg)
    this.meMatchBoard.classList.add(this.meCardCount === 4 ? 'game-board-2' : 'game-board-4')
    tmpLeg = document.createElement('legend')
    tmpLeg.innerText = 'Score'
    this.meScoreBoard.appendChild(tmpLeg)
    this.meScoreBoard.classList.add(this.meCardCount === 4 ? 'game-board-2' : 'game-board-4')
    this.meScoreBoard.appendChild(document.createElement('div'))

    this.meCards = new Array(this.meCardCount)
    for (let i = 0; i < this.meCards.length; i++) {
      this.meCards[i] = new this.GameCard(Math.floor(i / 2) + 1, this.meCardCount === 4 ? 50 : 25)
    }
    this.mePlayBoard.addEventListener('click', ev => {
      if (ev.target instanceof this.GameCard && !ev.target.isDeactivated && !ev.target.isShown) {
        ev.target.flipCard()
        let tmpShown = this.meCards.filter(elem => elem.isShown)
        if (tmpShown.length > 1) {
          this.meCounter++
          if (tmpShown[0].insideValue === tmpShown[1].insideValue) {
            this.correctTimer(tmpShown)
          } else {
            this.wrongTimer(tmpShown)
          }
        }
      }
    })
    this.shuffleCards()
    this.meCards.forEach(elem => this.mePlayBoard.appendChild(elem))
    this.meShadow.appendChild(this.meScoreBoard)
    this.meScoreBoard = this.meScoreBoard.lastElementChild
    this.meScoreBoard.innerText = '0'
    this.meShadow.appendChild(this.mePlayBoard)
    this.meShadow.appendChild(this.meMatchBoard)
    this._addControlBoard()
  }

  /**
   * // This method is for adding the game control board (added later and damn it's hard when not planned)
   */
  _addControlBoard () {
    let tmpImport = document.head.querySelector('link[rel="import"][href="/imports/GameMemory.html"]')
    let tmpBoard
    let tmpConstWin = () => { // Used to construct initial window window
      tmpBoard = tmpImport.import.getElementById('control-board').cloneNode(true)
      let tmpBut = tmpBoard.querySelector('#game-start-but')
      let tmpChoice = tmpBoard.querySelector('#game-choice')
      tmpBut.addEventListener('click', () => {
        while (this.meShadow.lastChild) {
          this.meShadow.removeChild(this.meShadow.lastChild)
        }
        this.meCardCount = parseInt(tmpChoice.options[tmpChoice.selectedIndex].value, 10)
        this.createdCallback()
      })
      this.meShadow.insertBefore(tmpBoard, this.meShadow.firstElementChild)
    }
    if (tmpImport) { // Check if the link is already on the page
      tmpConstWin()
    } else {
      tmpImport = document.createElement('link')
      tmpImport.setAttribute('rel', 'import')
      tmpImport.setAttribute('href', '/imports/GameMemory.html')
      document.head.appendChild(tmpImport)
      tmpImport.addEventListener('load', tmpConstWin)
    }
  }

  shuffleCards () {
    for (let i = this.meCards.length - 1; i > 0; i--) { // Shuffle the array. From 'https://www.frankmitchell.org/2015/01/fisher-yates/'
      let tmpRand = Math.floor(Math.random() * (i + 1))
      let tmpElem = this.meCards[i]
      this.meCards[i] = this.meCards[tmpRand]
      this.meCards[tmpRand] = tmpElem
    }
  }

  correctTimer (shownCards) {
    this.mePlayBoard.disabled = true
    window.setTimeout(() => {
      shownCards[0].deactivate()
      shownCards[1].deactivate()
      this.meMatchBoard.appendChild(new this.GameCard(shownCards[0].insideValue, this.meCardCount === 4 ? 50 : 25, true))
      this.meMatchBoard.appendChild(new this.GameCard(shownCards[1].insideValue, this.meCardCount === 4 ? 50 : 25, true))
      let tmpIsFin = true
      for (let i = 0; i < this.meCards.length; i++) {
        if (!this.meCards[i].isDeactivated) {
          tmpIsFin = false
          break
        }
      }
      this.meScoreBoard.innerText = this.meCounter
      if (tmpIsFin) {
        this.meScoreBoard.innerText += ' HAYY... You Win.'
      }
      this.mePlayBoard.disabled = false
    }, THE_CORR_RIME)
  }

  wrongTimer (shownCards) {
    this.mePlayBoard.disabled = true
    this.meScoreBoard.innerText = this.meCounter
    shownCards.forEach(elem => elem.flipError(true))
    window.setTimeout(() => {
      shownCards.forEach(elem => {
        elem.flipError(false)
        elem.flipCard(true)
      })
      this.mePlayBoard.disabled = false
    }, THE_ERR_TIME)
  }

  endApp () { // Nothing to do here (just removing the app from DOM is enough)
  }

  static get appIconURL () {
    return THE_APP_ICON
  }

  static get appName () {
    return THE_APP_NAME
  }

  static get defaultAppSize () {
    return {width: 320, height: 400}
  }
}

window.customElements.define('my-memory-game', GameMemory)

module.exports = GameMemory
