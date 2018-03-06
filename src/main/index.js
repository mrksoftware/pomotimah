'use strict'

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 46,
    useContentSize: true,
    width: 200,
    transparent: true,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    webPreferences: {
      overlayScrollbars: true
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setAlwaysOnTop(true)
  mainWindow.setIgnoreMouseEvents(false)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('move', () => {
    mainWindow.setIgnoreMouseEvents(false)
  })
}

app.on('ready', () => {
  createWindow()
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
