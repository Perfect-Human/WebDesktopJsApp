const THE_IMAGE_CLASS = 'img'
const THE_CARD_CLASS = 'game-card-'
const THE_ERR_CLASS = 'img-error'

class GameCard extends window.HTMLElement {
  constructor (insideValue, percentage, isNotActive) {
    super()
    this.meInVal = insideValue
    this.mePercent = percentage
    this.createdCallback()
    if (isNotActive) {
      this.flipCard(false)
      this.meAnch.removeAttribute('href')
    }
  }

  createdCallback () {
    let tmpStyle = document.createElement('link')
    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/GameCard.css')
    this.meShadow = this.attachShadow({mode: 'open'})
    this.meShadow.appendChild(tmpStyle)
    this.meAnch = document.createElement('a')
    this.meAnch.setAttribute('href', 'javascript:')
    this.meAnch.classList.add(THE_CARD_CLASS + this.mePercent)
    this.meAnch.classList.add(THE_IMAGE_CLASS + 0)
    this.meShadow.appendChild(this.meAnch)
  }

  flipCard (isHidden) {
    if (isHidden === true) {
      this.meAnch.classList.add(THE_IMAGE_CLASS + 0)
      this.meAnch.classList.remove(THE_IMAGE_CLASS + this.meInVal)
    } else if (isHidden === false) {
      this.meAnch.classList.add(THE_IMAGE_CLASS + this.meInVal)
      this.meAnch.classList.remove(THE_IMAGE_CLASS + 0)
    } else { // Else, just switch
      this.meAnch.classList.toggle(THE_IMAGE_CLASS + 0)
      this.meAnch.classList.toggle(THE_IMAGE_CLASS + this.meInVal)
    }
  }

  flipError (isError) {
    if (isError === true) {
      this.meAnch.classList.add(THE_ERR_CLASS)
    } else if (isError === false) {
      this.meAnch.classList.remove(THE_ERR_CLASS)
    } else {
      this.meAnch.classList.toggle(THE_ERR_CLASS)
    }
  }

  deactivate () {
    this.meAnch.classList.remove(THE_IMAGE_CLASS + 0)
    this.meAnch.classList.remove(THE_IMAGE_CLASS + this.meInVal)
    this.meAnch.removeAttribute('href')
  }

  get insideValue () {
    return this.meInVal
  }

  get isShown () {
    return this.meAnch.classList.contains(THE_IMAGE_CLASS + this.meInVal)
  }

  get isDeactivated () {
    for (let i = 0; i < this.meAnch.classList.length; i++) {
      if (this.meAnch.classList.item(i).startsWith(THE_IMAGE_CLASS)) {
        return false
      }
    }
    return true
  }
}

window.customElements.define('my-game-card', GameCard)

module.exports = GameCard
