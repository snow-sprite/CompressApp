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
// 与render进程通信{多文件类型}
ipcMain.on('uploadMultipleMessage', (event, fPath, globalKey, isSingle, type) => {
  tinify.key = globalKey

  sourcePath = fPath
  if (isSingle) {
    targetPath = path.resolve(`${fPath}_compressed`)
  } else {
    targetPath = `${path.dirname(fPath)}${path.sep}${type}_compressed`
  }
  compresePic(event, sourcePath, isSingle, type)
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
function readFPath (fPath, eventReply, isSingle, type) {
  fs.lstat(fPath, function (errs, stat) {
    if (errs) throw errs
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

      // 这里的作用是根据后缀名称渲染不同结果
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
                  // eventReply.sender.send('rebuildCount', tinify.compressionCount)
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
      // 前面传过来的，根据需要选择是否要遍历文件夹
      fs.readdir(fPath, function (errDir, files) {
        if (errDir) throw errDir
        // 同步生成目标目录
        walkDir(fPath, sourcePath, targetPath)
        for (let file of files) {
          readFPath(path.join(fPath, file), eventReply, isSingle, type)
        }
      })
    }
  })
}

// 重构目标目录
function compresePic (event, sPath, isSingle, type) {
  // comprese image..
  try {
    fs.access(targetPath, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(targetPath, () => {
          rebuildTarget(targetPath, sPath, event, isSingle, type)
        })
      } else {
        rebuildTarget(targetPath, sPath, event, isSingle, type)
      }
    })
  } catch (error) {
    throw error
  }
}

// 重构目标文件
function rebuildTarget (target, sPath, event, isSingle, type) {
  // 这两行是初始化列表
  renderArr = []
  FILENUM = 0
  FINISHEDFILENUM = 0
  // 如果是全图片 则不清空压缩文件夹
  if (type !== 'imgs') reBuildDir(target)
  readFPath(sPath, event, isSingle, type)
}
