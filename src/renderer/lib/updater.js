import {
  autoUpdater
} from 'electron-updater'

import {
  ipcMain
} from 'electron'
let mainWindow = null
const message = {
  error: '检查到更新出错 : (',
  checking: '正在检查更新……',
  updateAva: '检测到新版本，正在下载……',
  updateNotAva: '您当前已是最新版本 : )',
  download: '已下载最新版本！'
}
// 检测机制
export function updateHandleByDefault (window, feedUrl) {
  mainWindow = window
  // 设置更新包的地址
  autoUpdater.setFeedURL(feedUrl)
  // 监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (a, b, c, d, e) {
    console.log('checking-for-update+++++++++++++++', a, b, c, d, e)
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: message.checking
    })
  })
  // 监听发现可用更新事件
  autoUpdater.on('update-available', function (message, a, b, c, d, e) {
    console.log('update-available+++++++++++++++', a, b, c, d, e)
    sendUpdateMessage({
      cmd: 'update-available',
      message: message
    })
  })

  // 接收渲染进程消息，开始检查更新
  ipcMain.on('checkForUpdateByDefault', (e, arg) => {
    // 执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates()
  })
}

// 更新机制
export function updateHandleByRoot (window, feedUrl) {
  mainWindow = window
  // 设置更新包的地址
  autoUpdater.setFeedURL(feedUrl)
  // 监听没有可用更新事件
  autoUpdater.on('update-not-available', function () {
    console.log('update-not-available+++++++++++++++++++++++++++++++++++')
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message.updateNotAva
    })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    console.log('download-progress++++++++++++++++++++++++++++++++++')
    console.log('JSON', JSON.stringify(progressObj))
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj
    })
  })
  // 监听下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
    console.log('update-downloaded+++++++++++++++++++++++++++')
    // console.log('update-downloaded====================================')
    // console.log('update-downloaded1', JSON.stringify(releaseNotes))
    // console.log('update-downloaded2', JSON.stringify(releaseName))
    // console.log('update-downloaded3', JSON.stringify(releaseDate))
    // console.log('update-downloaded4', JSON.stringify(updateUrl))
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message: message.download
    })
    // 退出并安装更新包
    // autoUpdater.quitAndInstall()
  })

  // 监听升级失败事件
  autoUpdater.on('error', function () {
    sendUpdateMessage({
      cmd: 'error',
      message: message.error
    })
  })

  // 接收渲染进程消息，开始检查更新
  // ipcMain.on('checkForUpdateByRoot', (e, arg) => {
  //   // 执行自动更新检查
  //   // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
  //   autoUpdater.checkForUpdates()
  // })
}

// 给渲染进程发送消息
function sendUpdateMessage (text) {
  mainWindow.webContents.send('message', text)
}
