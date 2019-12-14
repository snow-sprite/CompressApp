import {
  ipcMain
} from 'electron'
import tinify from 'tinify'
import { pathLink } from '../lib/formatter'
// import fs from 'fs'
import path from 'path'

// 默认下载路径为 「下载」 目录
// mac OS
const onlineCompressTarget = `/Users/${process.env.LOGNAME}/Downloads`
// TODO windows下载目录

const API_KEY = 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN'
tinify.key = API_KEY

var arr = [1, 2, 3]

ipcMain.on('onlineImgCompress', function (event, url) {
  compressOnlineImg(event, url)
})

// 压缩在线图片
function compressOnlineImg (eventReply, url) {
  let minName = pathLink(url, true)
  tinify.fromUrl(url)
    .toFile(path.join(onlineCompressTarget, `/${minName}`), () => {
      console.log('Finished!')
      eventReply.sender.send('compressedOnlineImg', arr)
      eventReply.sender.send('rebuildCount', tinify.compressionCount)
    })
}
