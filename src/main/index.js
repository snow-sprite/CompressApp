'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  dialog,
  shell,
  ipcMain
} from 'electron'
import path from 'path'
import pkg from '../../package.json'
import {
  updateHandleByDefault,
  updateHandleByRoot
} from '../renderer/lib/updater'
// Local
import './localBridge'
import './localSingleBridge'

// Online
import './onlineBridge'
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

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

const BugsIssues = 'https://github.com/snow-sprite/CompressApp/issues'
// 自定义任务栏
const contextMenu = Menu.buildFromTemplate([{
  label: 'Reload',
  role: 'reload'
}, {
  label: 'About',
  type: 'normal',
  toolTip: 'about',
  click: () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'About',
      message: `
        ${pkg.description}\n
        version: ${pkg.version}\n
        ${pkg.author.name}<${pkg.author.email}>`
    })
    // process.exit()
  }
}, {
  label: 'Bugs Report',
  type: 'normal',
  click: () => {
    if (shell) shell.openExternal(BugsIssues)
  }
}, {
  label: 'Quit',
  role: 'quit'
}])

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 900,
    opacity: 0.96,
    useContentSize: true,
    maximizable: false,
    // transparent: true,
    resizable: false,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', e => {
    // TODO 由于新添加的autoUpdater机制 mainWindow在关闭时已被销毁 不能托盘显示
    // mainWindow && mainWindow.hide()
    mainWindow = null
    e.returnValue = false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    // 检测更新设置
    let feedUrl = pkg.build.publish[0].url
    if (mainWindow) updateHandleByDefault(mainWindow, feedUrl)
    // 手动检测更新
    ipcMain.on('checkForUpdateByRoot', (event) => {
      if (mainWindow) updateHandleByRoot(mainWindow, feedUrl)
    })
  })
}

app.on('ready', () => {
  createWindow()
  const trayIcon = new Tray(path.join(__static, './tray/16x16.png'))
  trayIcon.on('right-click', () => {
    trayIcon.popUpContextMenu(contextMenu)
  })
  trayIcon.on('click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/*
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
// autoUpdater.setFeedURL({
//   provider: 'github',
//   url: 'https://github.com/snow-sprite/CompressApp'
// })

// autoUpdater.on('update-available', function (info) {
//   console.log(1, info)
//   console.log('Update available.')
// })
