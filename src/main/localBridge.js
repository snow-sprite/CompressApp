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

// 与render进程通信
ipcMain.on('uploadEventMessage', (event, fPath, globalKey) => {
  tinify.key = globalKey
  sourcePath = fPath
  targetPath = path.resolve(`${fPath}_compresed`)
  compresePic(event)
})

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
function readFPath (fPath, eventReply) {
  // 同步生成目标目录
  walkDir(fPath, sourcePath, targetPath)
  fs.lstat(fPath, function (errs, stat) {
    if (errs) throw errs
    if (stat.isFile()) {
      //  compressing...
      /*
       * 重构数据结构
       */
      // 这里得到的是name值
      let realName = path.basename(fPath)
      // 这里的是压缩后的名字 例如：avatar.min.png
      let minName = `${realName.split('.')[0]}.min.${realName.split('.')[1]}`
      let filePath = path.dirname(fPath)
      let fileTmpPath = filePath.slice(sourcePath.length)
      // 压缩后的文件的路径
      let compressedTargetPath = `${targetPath}${fileTmpPath}`
      // 这里的作用是排除非指定后缀文件
      let extname = path.extname(path.resolve(fPath)).slice(1)
      if (imagesType.indexOf(extname) > -1) {
        renderArr.push({
          name: realName,
          minName,
          size: stat.size,
          path: `${fPath}`,
          compressedSize: null,
          compressedPath: compressedTargetPath
        })
        FILENUM = renderArr.length
      }
      eventReply.sender.send('filesList', renderArr)
      // 重新生成的新名字
      let generatePathName
      generatePathName = `${compressedTargetPath}${path.sep}${minName}`
      // TODO 不能压缩的文件copy到目标目录
      // tinypng api
      tinify
        .fromFile(path.resolve(fPath))
        .toFile(
          generatePathName,
          () => {
            if (imagesType.indexOf(extname) > -1) {
              FINISHEDFILENUM += 1
            }
            // 得到压缩后文件的size和path，推到原有数组里
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
                  eventReply.sender.send('rebuildCount', tinify.compressionCount)
                }
              })
            }
            // TODO sync生成压缩包
            if (FILENUM === FINISHEDFILENUM) {
              let targetFileName = path.basename(targetPath)
              let newTargetPath = `${path.dirname(targetPath)}${path.sep}`
              zipper.zip(targetPath, (errZip, zipped) => {
                if (errZip) throw errZip
                zipped.compress()
                zipped.save(`${newTargetPath}${targetFileName}.zip`, errSave => {
                  if (errSave) throw errSave
                  console.log('这应该是最后一次压缩了')
                  eventReply.sender.send('AllDone')
                  // eventReply.sender.send('dragEventReply', true)
                  // TODO 打完压缩包后删除目标文件夹
                  // rebuildTarget(targetPath, event, true);
                })
              })
            }
          }
        )
    } else if (stat.isDirectory()) {
      // read dir...
      fs.readdir(fPath, function (errDir, files) {
        if (errDir) throw errDir
        for (let file of files) {
          readFPath(path.join(fPath, file), eventReply)
        }
      })
    }
  })
}

// 重构目标目录
function compresePic (event) {
  // comprese image..
  try {
    fs.access(targetPath, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(targetPath, () => {
          rebuildTarget(targetPath, event)
        })
      } else {
        rebuildTarget(targetPath, event)
      }
    })
  } catch (error) {
    throw error
  }
}

// 重构目标文件
function rebuildTarget (target, event) {
  // 这两行是初始化列表
  renderArr = []
  FILENUM = 0
  FINISHEDFILENUM = 0

  reBuildDir(target)
  readFPath(sourcePath, event)
}
