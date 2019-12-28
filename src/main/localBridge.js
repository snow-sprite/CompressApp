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
// isNeedWalk：是否需要遍历文件夹 isWalkDir: 是否全是文件夹
ipcMain.on('uploadMultipleMessage', (event, fPath, globalKey, isNeedWalk, isWalkDir) => {
  tinify.key = globalKey
  if (isNeedWalk) {
    sourcePath = fPath
    targetPath = path.resolve(`${fPath}_compressed`)
    if (isWalkDir) {
      // 多文件夹
      sourcePath = path.dirname(fPath)
      targetPath = `${path.dirname(fPath)}_dirs_compressed`
    }
  } else {
    sourcePath = path.dirname(fPath)
    targetPath = `${path.dirname(fPath)}_images_compressed`
  }
  // TODO 多文件类型 后来的文件名会覆盖原来的文件名
  compresePic(event, isNeedWalk, isWalkDir)
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
function readFPath (fPath, eventReply, isNeedWalk, isWalkDir) {
  // 同步生成目标目录
  if (isNeedWalk) walkDir(fPath, sourcePath, targetPath)
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
            if (imagesType.indexOf(extname) > -1) FINISHEDFILENUM += 1

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
      // 前面传过来的，根据需要选择是否要遍历文件夹
      fs.readdir(fPath, function (errDir, files) {
        if (errDir) throw errDir
        for (let file of files) {
          if (isNeedWalk) {
            readFPath(path.join(fPath, file), eventReply, isNeedWalk, isWalkDir)
          } else {
            // 多图片形式
            let fileStats = fs.lstatSync(path.join(fPath, file))
            if (fileStats.isFile()) {
              // 这里的作用是排除非指定后缀文件
              readFPath(path.join(fPath, file), eventReply, isNeedWalk, isWalkDir)
            }
          }
        }
      })
    }
  })
}

// 重构目标目录
function compresePic (event, isNeedWalk, isWalkDir) {
  // comprese image..
  try {
    fs.access(targetPath, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(targetPath, () => {
          rebuildTarget(targetPath, event, isNeedWalk, isWalkDir)
        })
      } else {
        rebuildTarget(targetPath, event, isNeedWalk, isWalkDir)
      }
    })
  } catch (error) {
    throw error
  }
}

// 重构目标文件
function rebuildTarget (target, event, isNeedWalk, isWalkDir) {
  // 这两行是初始化列表
  renderArr = []
  FILENUM = 0
  FINISHEDFILENUM = 0
  if (isNeedWalk) reBuildDir(target)
  readFPath(sourcePath, event, isNeedWalk, isWalkDir)
}
