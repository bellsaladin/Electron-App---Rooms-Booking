const path = require('path')
const glob = require('glob')
const electron = require('electron')
const autoUpdater = require('./auto-updater')

const BrowserWindow = electron.BrowserWindow
const app = electron.app
const ipcMain = electron.ipcMain

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')

var introWindow = null
var mainWindow = null

function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadDemos()

  function createWindow () {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      show : false
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    // load the intro window
    introWindow = new BrowserWindow(windowOptions)
    introWindow.loadURL(path.join('file://', __dirname, '/intro.html'))
    introWindow.maximize()
    introWindow.once('ready-to-show', () => {
          introWindow.show();
    })

    mainWindow = new BrowserWindow(windowOptions)
    // load the mainWindow
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
    mainWindow.maximize()
    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      require('devtron').install()
    }

    pdfWorkerWindow = new BrowserWindow();
    pdfWorkerWindow.loadURL("file://" + __dirname + "/pdf-worker.html");
    pdfWorkerWindow.hide();
    pdfWorkerWindow.webContents.openDevTools();
    pdfWorkerWindow.on("closed", () => {
        pdfWorkerWindow = undefined;
    });

    mainWindow.once('ready-to-show', () => {
        /*var sleepSeconds = 2;
        for(var i = 0; i< 1000000000 * sleepSeconds; i++){
          // sleep    
        }*/
        introWindow.hide();
        introWindow.destroy();
        mainWindow.show();
        // load the application after the intro
    })

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow()
    autoUpdater.initialize()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// retransmit it to workerWindow
ipcMain.on("printPDF", function (event, content) {
    console.log(content);
    pdfWorkerWindow.webContents.send("printPDF", content);
});


/*ipcMain.on('print-to-pdf', function (event) {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const win = BrowserWindow.fromWebContents(event.sender)
  // Use default printing options
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})*/

const os = require('os')
const fs = require('fs')
const shell = electron.shell

// when worker window is ready
ipcMain.on("readyToPrintPDF", function(event){
    const pdfPath = path.join(os.tmpdir(), 'print.pdf');
    // Use default printing options
    pdfWorkerWindow.webContents.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(pdfPath, data, function (error) {
            if (error) {
                throw error
            }
            shell.openItem(pdfPath)
            event.sender.send('wrote-pdf', pdfPath)
        })
    })
});


// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos () {
  var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach(function (file) {
    require(file)
  })
  autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}
