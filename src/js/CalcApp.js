// Based on a ready working implementation from: https://codepen.io/BKHilton/pen/OXBjrb
const THE_APP_ICON = '/image/calc-app-icon.png'
const THE_APP_NAME = 'Calculator'

class CalcApp extends window.HTMLElement {
  constructor () {
    super()
    this.createdCallback()
  }

  createdCallback () {
    let tmpStyle = document.createElement('link')
    let tmpLink = document.head.querySelector('link[rel="import"][href="/imports/CalcApp.html"]')
    this._shadow = this.attachShadow({mode: 'open'})

    tmpStyle.setAttribute('rel', 'stylesheet')
    tmpStyle.setAttribute('href', '/css/CalcApp.css')
    this._shadow.appendChild(tmpStyle)

    let tmpConstWin = () => {
      let tmpAllCalc = tmpLink.import.querySelector('#container').cloneNode(true)
      this._shadow.appendChild(tmpAllCalc)

      // Declare and initialize my button operations
      let add = tmpAllCalc.querySelector('#add')
      let subtract = tmpAllCalc.querySelector('#subtract')
      let multiply = tmpAllCalc.querySelector('#multiply')
      let divide = tmpAllCalc.querySelector('#divide')
      let clearbutton = tmpAllCalc.querySelector('#clear')
      let equals = tmpAllCalc.querySelector('#equals')
      // array to push operations into
      let allnumbers = []
      // Declare numbers variable for 'for' loop
      let numbers = tmpAllCalc.querySelectorAll('.number')
      // For Loop is to power what happens when the user clicks on any of the buttons
      // .... which all have the .number class
      for (let i = 0; i < numbers.length; i++) {
        numbers[i].addEventListener('click', function (event) {
          let valueAsInteger = parseInt(event.target.value)
          allnumbers.push(valueAsInteger)
          tmpAllCalc.querySelector('#results').value += event.target.value
        })
      };
      add.addEventListener('click', function (event) {
        tmpAllCalc.querySelector('#results').value += '+'
        allnumbers.push('+')
      })
      subtract.addEventListener('click', function (event) {
        tmpAllCalc.querySelector('#results').value += '-'
        allnumbers.push('-')
      })
      divide.addEventListener('click', function (event) {
        tmpAllCalc.querySelector('#results').value += '/'
        allnumbers.push('/')
      })
      multiply.addEventListener('click', function (event) {
        tmpAllCalc.querySelector('#results').value += '*'
        allnumbers.push('*')
      })
      equals.addEventListener('click', function (event) {
        let a = allnumbers[0]
        let b = allnumbers[2]
        let result
        if (allnumbers[1] === '+') {
          result = a + b
        } else if (allnumbers[1] === '-') {
          result = a - b
        } else if (allnumbers[1] === '/') {
          result = a / b
        } else if (allnumbers[1] === '*') {
          result = a * b
        }
        tmpAllCalc.querySelector('#results').value = result
      })
      clearbutton.addEventListener('click', function (event) {
        tmpAllCalc.querySelector('#results').value = ''
        allnumbers = []
      })
    }
    if (tmpLink) { // Check if the link is already on the page
      tmpConstWin()
    } else {
      tmpLink = document.createElement('link')
      tmpLink.setAttribute('rel', 'import')
      tmpLink.setAttribute('href', '/imports/CalcApp.html')
      document.head.appendChild(tmpLink)
      tmpLink.addEventListener('load', tmpConstWin)
    }
  }

  // From here down is considered the interface for an app //

  /**
   * Ends the application gracefully
   */
  endApp () {
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
    return {width: 430, height: 395}
  }
}

window.customElements.define('my-calc-app', CalcApp)

module.exports = CalcApp
