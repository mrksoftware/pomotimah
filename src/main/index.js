'use strict'

import { app, BrowserWindow, dialog, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path')
const isDev = require('electron-is-dev')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
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
  mainWindow.setMinimizable(false)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('move', () => {
    mainWindow.setIgnoreMouseEvents(false)
  })
  var thumbBarButtons = [
    {
      tooltip: 'Skip',
      icon: nativeImage.createFromPath(path.join(__static, 'images', 'next-track.png')),
      click () { mainWindow.webContents.send('skip-slot') }
    },
    {
      tooltip: 'Play',
      icon: nativeImage.createFromPath(path.join(__static, 'images', 'play-button.png')),
      click () {
        /* if (mainWindow.isAlwaysOnTop()) {
          thumbBarButtons[3].icon = nativeImage.createFromPath(path.join(__static, 'images', 'always-on-top-off.png'))
        } else {
          thumbBarButtons[3].icon = nativeImage.createFromPath(path.join(__static, 'images', 'always-on-top-on.png'))
        } */
        mainWindow.webContents.send('play-pause-timer')
      }
    },
    {
      tooltip: 'Check Update',
      icon: nativeImage.createFromPath(path.join(__static, 'images', 'progress-arrows.png')),
      click () { autoUpdater.checkForUpdates() }
    },
    {
      tooltip: 'Always on top',
      icon: nativeImage.createFromPath(path.join(__static, 'images', 'always-on-top-off.png')),
      click () {
        mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
        if (mainWindow.isAlwaysOnTop()) {
          thumbBarButtons[3].icon = nativeImage.createFromPath(path.join(__static, 'images', 'always-on-top-off.png'))
        } else {
          thumbBarButtons[3].icon = nativeImage.createFromPath(path.join(__static, 'images', 'always-on-top-on.png'))
        }
        mainWindow.setThumbarButtons(thumbBarButtons)
      }
    }
  ]
  mainWindow.setThumbarButtons(thumbBarButtons)
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

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  mainWindow.webContents.send('auto-updater-ping', 'Update downloaded...')
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('auto-updater-ping', 'Checking for update')
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('auto-updater-ping', 'No update available..')
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('auto-updater-ping', 'Getting new update...')
})

autoUpdater.on('download-progress', (event, progress) => {
  mainWindow.webContents.send('auto-updater-ping', JSON.stringify(progress))
})
