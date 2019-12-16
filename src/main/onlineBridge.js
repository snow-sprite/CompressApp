import {
  ipcMain
} from 'electron'
import tinify from 'tinify'
import {
  pathLink, // 在线图片地址
  downloadPath // 默认下载路径为 「下载」 目录
} from '../lib/formatter'
// import fs from 'fs'
import path from 'path'

const API_KEY = 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN'
tinify.key = API_KEY

ipcMain.on('onlineImgCompress', function (event, url) {
  compressOnlineImg(event, url)
})

// 压缩在线图片
function compressOnlineImg (eventReply, url) {
  let compressedOnlineImgPath = downloadPath()
  let minName = pathLink(url, true)
  tinify.fromUrl(url)
    .toFile(path.join(compressedOnlineImgPath, `${minName}`), () => {
      eventReply.sender.send('compressedOnlineImg', compressedOnlineImgPath)
      // 将当前apikey的编译量传送给页面
      eventReply.sender.send('rebuildCount', tinify.compressionCount)
    })
}
