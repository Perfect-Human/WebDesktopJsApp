startUp()

function startUp () {
  // let AppWin = require('./AppWindow')
  // document.body.appendChild(new AppWin('Window title'))
  let WebDtop = require('./WebDesktop')
  let tmpDtop = new WebDtop()
  tmpDtop.addApp(require('./GameMemory'))
  tmpDtop.addApp(require('./ChatApp'))
  tmpDtop.addApp(require('./GameClick'))
  tmpDtop.addApp(require('./InterminatorApp'))
  tmpDtop.addApp(require('./CalcApp'))
  document.body.insertBefore(tmpDtop, document.body.firstChild)
}
