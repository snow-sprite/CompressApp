import {
  ipcMain,
  dialog
} from 'electron'
import zipper from 'zip-local'
import tinify from 'tinify'
import fs from 'fs'
import path from 'path'
import { validityApi } from '../utils/formatter'
import { walkDir } from '../utils/walkDir'
import { reBuildDir } from '../utils/rmDir'

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

// 验证文件是不是以'.'开头的系统文件等
let nameReg = new RegExp(/^\./)
// 与render进程通信
ipcMain.on('uploadEventMessage', function (event, fPath, globalKey) {
  tinify.key = globalKey
  // 验证tinyapi的有效性
  validityApi()
    .then(() => {
      sourcePath = fPath
      targetPath = path.resolve(`${fPath}_compresed`)
      compresePic(event)
    })
    .catch(err => {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Warning Box',
        message: `${err.status}`,
        detail: `${err.message}`,
        buttons: ['cancel', 'ok'],
        defaultId: 1,
        cancelId: 0
      })
      // process.exit()
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
      let realName
      let nameArrLeng
      nameArrLeng = fPath.split(path.sep).length
      // 这里得到的是name值
      realName = fPath.split(path.sep)[nameArrLeng - 1]
      // 这里的是压缩后的名字 例如：avatar.min.png
      let minName = `${realName.split('.')[0]}.min.${realName.split('.')[1]}`
      let filePath = path.dirname(fPath)
      let fileTmpPath = filePath.slice(sourcePath.length)
      // 压缩后的文件的路径
      let compressedTargetPath = `${targetPath}${fileTmpPath}`
      // 这里的作用是排除以'.'开头的系统文件等
      if (!nameReg.test(realName)) {
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
      // tinypng api
      tinify
        .fromFile(path.resolve(fPath))
        .toFile(
          generatePathName,
          () => {
            FINISHEDFILENUM += 1
            // 得到压缩后文件的size和path，推到原有数组里
            if (!nameReg.test(realName)) {
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
              let targetPathArr = targetPath.split(path.sep)
              let targetFileName = targetPathArr[targetPathArr.length - 1]
              let newTargetPath = targetPath.replace(
                targetPathArr[targetPathArr.length - 1],
                ''
              )
              zipper.zip(targetPath, function (errZip, zipped) {
                if (errZip) throw errZip
                zipped.compress()
                zipped.save(`${newTargetPath}${targetFileName}.zip`, function (
                  errSave
                ) {
                  if (errSave) throw errSave
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
      }
      rebuildTarget(targetPath, event)
    })
  } catch (error) {
    throw error
  }
}

// 重构目标文件
function rebuildTarget (target, event, isDel) {
  // 这两行是初始化列表
  renderArr = []
  FILENUM = 0
  FINISHEDFILENUM = 0
  reBuildDir(target)
  readFPath(sourcePath, event)
}
