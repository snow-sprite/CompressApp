/**
 * 单文件压缩
*/
import {
  ipcMain
} from 'electron'
import tinify from 'tinify'
import fs from 'fs'
import path from 'path'
import imagesType from './lib/imagesType'

// 源文件夹
var sourcePath = ''
// 目标文件夹
var targetPath = ''

// 要渲染的被压缩图片列表
let renderArr = []
let caleInd = 1
let currentInd
// {单图类型}
ipcMain.on('uploadSingleImgMessage', (event, fPath, globalKey) => {
  tinify.key = globalKey
  sourcePath = fPath
  targetPath = path.dirname(fPath)
  // params: ElectronEvent, 源文件地址，目标地址目录，文件名
  reBuildSingleImg(event, sourcePath, targetPath)
})

function reBuildSingleImg (event, sourcePath, targetPath) {
  let realName = path.basename(sourcePath)
  let minName = `${path.basename(realName, path.extname(realName))}.min${path.extname(realName)}`
  let targetPathWithStat = `${targetPath}${path.sep}${minName}`

  // 页面渲染列表
  let fStat = fs.statSync(sourcePath)
  let extname = path.extname(sourcePath).slice(1)
  if (imagesType.indexOf(extname) > -1) {
    renderArr.unshift({
      isSupport: true,
      name: realName,
      minName,
      size: fStat.size,
      path: `${sourcePath}`,
      compressedSize: null,
      compressedPath: targetPath
    })
  } else {
    renderArr.unshift({
      isSupport: false,
      name: realName,
      minName,
      size: fStat.size
    })
  }
  event.sender.send('filesList', renderArr)

  // 压缩
  tinify.fromFile(sourcePath).toFile(targetPathWithStat, errTiny => {
    if (errTiny && errTiny.message.indexOf('Your monthly limit has been exceeded') >= 0) {
      event.sender.send('limitCountErrorEvent')
      return
    }
    fs.lstat(targetPathWithStat, function (errDoneFile, doneFileStat) {
      if (errDoneFile) throw errDoneFile
      currentInd = renderArr.length - caleInd
      renderArr[currentInd].compressedSize = doneFileStat.size
      caleInd += 1
      event.sender.send('finishedItem', renderArr)
    })
    // 重新计数，重绘图表
    event.sender.send('finishedItem', renderArr)
    // 提醒
    event.sender.send('AllDone')
  })
}
