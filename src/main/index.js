'use strict'

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
const isDev = require('electron-is-dev')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = isDev
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
  if (!isDev) {
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
  console.log('--check')
  mainWindow.webContents.send('update-downloaded')
  autoUpdater.quitAndInstall()
})

autoUpdater.on('checking-for-update', () => {
  console.log('--check')
  mainWindow.webContents.send('checking-for-update')
})

autoUpdater.on('update-not-available', () => {
  console.log('--not')
  mainWindow.webContents.send('update-not-available')
})

autoUpdater.on('update-available', () => {
  console.log('--yep')
  mainWindow.webContents.send('update-available')
})

autoUpdater.on('download-progress', (progress) => {
  let message = `${progress.percent}% at ${progress.bytesPerSecond}Mb/s`
  mainWindow.webContents.send('download-progress', message)
})
