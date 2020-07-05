import {
  ipcMain,
  dialog
} from 'electron'
import zipper from 'zip-local'
import tinify from 'tinify'
import fs from 'fs'
import path from 'path'
import { walkDir } from './lib/walkDir'
import { reBuildDir } from './lib/rmDir'
// images white list
import imagesType from './lib/imagesType'
// 源文件夹
var sourcePath = ''
// 目标文件夹
var targetPath = ''

// 文件数量
var FILENUM = 0
// 已压缩文件数
var FINISHEDFILENUM = 0

// 要渲染的被压缩图片列表
let renderArr = []
// {多文件类型}
ipcMain.on('uploadMultipleMessage', (event, fPath, globalKey, isSingle) => {
  tinify.key = globalKey

  sourcePath = fPath
  // 设置一个目标压缩父目录
  targetPath = path.resolve(`${sourcePath}ed`)
  if (!isSingle) targetPath = `sourcePath${path.sep}${path.basename(sourcePath)}`
  console.log('targetPath++++++++targetPath+++++++++++++', targetPath)
  compresePic(event, sourcePath)
})

// 错误捕获
ipcMain.on('validateApiLocalError', (event, errObj) => {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Warning Box',
    message: `${errObj.status}`,
    detail: `${errObj.message}`,
    buttons: ['cancel', 'ok'],
    defaultId: 1,
    cancelId: 0
  })
})

// 读取文件夹
function readFPath (eventReply, fPath, type) {
  fs.lstat(fPath, function (errs, stat) {
    if (errs) throw errs && process.exit()
    if (stat.isFile()) {
      //  compressing...
      /*
       * 重构数据结构
       */
      // 这里得到的是name值 例如:avatar.png
      let realName = path.basename(fPath)
      // 这里的是压缩后的名字 例如：avatar.min.png
      let minName = `${path.basename(realName, path.extname(realName))}.min${path.extname(realName)}`
      let filePath = path.dirname(fPath)
      let fileTmpPath = filePath.slice(sourcePath.length)
      // 压缩后的文件的路径
      let compressedTargetPath = `${targetPath}${fileTmpPath}`

      // 保存文件信息
      let extname = path.extname(path.resolve(fPath)).slice(1)
      if (imagesType.indexOf(extname) > -1) {
        renderArr.push({
          isSupport: true,
          name: realName,
          minName,
          size: stat.size,
          path: `${fPath}`,
          compressedSize: null,
          compressedPath: compressedTargetPath
        })
      } else {
        renderArr.push({
          isSupport: false,
          name: realName,
          size: stat.size
        })
      }
      FILENUM = renderArr.length
      eventReply.sender.send('filesList', renderArr)
      // 重新生成的新名字
      let generatePathName
      generatePathName = `${compressedTargetPath}${path.sep}${minName}`
      // tinypng api
      tinify
        .fromFile(path.resolve(fPath))
        .toFile(
          generatePathName,
          (errTiny, b) => {
            if (errTiny && errTiny.message.indexOf('Your monthly limit has been exceeded') >= 0) {
              eventReply.sender.send('limitCountErrorEvent')
              return
            }
            FINISHEDFILENUM += 1
            // 保存压缩后的信息
            if (imagesType.indexOf(extname) > -1) {
              fs.lstat(generatePathName, function (errDoneFile, doneFileStat) {
                if (errDoneFile) throw errDoneFile
                if (FINISHEDFILENUM >= 0) {
                  for (let item of renderArr) {
                    if (item.name === realName) {
                      item.compressedSize = doneFileStat.size
                    }
                  }
                  eventReply.sender.send('finishedItem', renderArr)
                  // eventReply.sender.send('rebuildCount', tinify.compressionCount)
                }
              })
            }
            if (FILENUM === FINISHEDFILENUM) {
              let targetFileName = path.basename(targetPath)
              let newTargetPath = `${path.dirname(targetPath)}${path.sep}`
              zipper.zip(targetPath, (errZip, zipped) => {
                if (errZip) throw errZip
                zipped.compress()
                zipped.save(`${newTargetPath}${targetFileName}.zip`, errSave => {
                  if (errSave) throw errSave
                  console.log('这是最后一次压缩了')
                  eventReply.sender.send('AllDone')
                  // TODO 打完压缩包后删除目标文件夹
                  // rebuildTarget(targetPath, event, true);
                })
              })
            }
          })
    } else if (stat.isDirectory()) {
      // read dir...
      // 遍历文件夹
      fs.readdir(fPath, function (errDir, files) {
        if (errDir) throw errDir && process.exit()
        walkDir(fPath, sourcePath, targetPath)
        for (let file of files) {
          readFPath(eventReply, path.join(fPath, file), type)
        }
      })
    }
  })
}

// comprese image..重构目标目录
function compresePic (event, sPath) {
  try {
    fs.access(targetPath, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(targetPath, () => {
          rebuildTarget(event, targetPath, sPath)
        })
      } else {
        rebuildTarget(event, targetPath, sPath)
      }
    })
  } catch (error) {
    throw error
  }
}

// 重构目标文件
function rebuildTarget (event, target, sPath) {
  renderArr = []
  FILENUM = 0
  FINISHEDFILENUM = 0

  reBuildDir(target)
  readFPath(event, sPath)
}
