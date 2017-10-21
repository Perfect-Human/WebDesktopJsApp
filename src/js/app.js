startUp()

function startUp () {
  // let AppWin = require('./AppWindow')
  // document.body.appendChild(new AppWin('Window title'))
  let WebDtop = require('./WebDesktop')
  let tmpDtop = new WebDtop()
  tmpDtop.addApp(require('./GameMemory'))
  document.body.insertBefore(tmpDtop, document.body.firstChild)
}
