/**
 * 单文件压缩
*/
import {
  ipcMain
} from 'electron'
import tinify from 'tinify'
import fs from 'fs'
import path from 'path'

// 源文件夹
var sourcePath = ''
// 目标文件夹
var targetPath = ''

// 要渲染的被压缩图片列表
let renderArr = []

// 与render进程通信{单图类型}
ipcMain.on('uploadSingleImgMessage', (event, fPath, globalKey) => {
  tinify.key = globalKey
  sourcePath = fPath
  targetPath = path.dirname(fPath)
  // params: ElectronEvent, 源文件地址，目标地址目录，文件名
  reBuildSingleImg(event, sourcePath, targetPath)
})

function reBuildSingleImg (event, sourcePath, targetPath) {
  // 重命名目标文件
  let realName = path.basename(sourcePath)
  let minName = `${realName.split('.')[0]}.min.${realName.split('.')[1]}`
  let targetPathWithStat = `${targetPath}${path.sep}${minName}`

  // 页面渲染列表
  let fStat = fs.statSync(sourcePath)
  renderArr.push({
    name: realName,
    minName,
    size: fStat.size,
    path: `${sourcePath}`,
    compressedSize: null,
    compressedPath: targetPath
  })
  event.sender.send('filesList', renderArr)

  // 压缩
  tinify.fromFile(sourcePath).toFile(targetPathWithStat, _ => {
    fs.lstat(targetPathWithStat, function (errDoneFile, doneFileStat) {
      if (errDoneFile) throw errDoneFile
      for (let item of renderArr) {
        item.compressedSize = doneFileStat.size
      }
      event.sender.send('finishedItem', renderArr)
    })
    // 重新计数，重绘图表
    event.sender.send('finishedItem', renderArr)
    // 完成后，通知render区，做提醒
    event.sender.send('AllDone')
  })
}
