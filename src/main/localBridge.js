import {
  ipcMain
} from 'electron'
import zipper from 'zip-local'
import tinify from 'tinify'
import {
  pathLink
} from '../lib/formatter'
import fs from 'fs'
import path from 'path'

const API_KEY = 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN'
tinify.key = API_KEY

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
ipcMain.on('uploadEventMessage', function (event, fPath) {
  sourcePath = fPath
  targetPath = path.resolve(`${fPath}-compresed`)
  compresePic(event)
})
// 读取文件夹
function readFPath (fPath, eventReply) {
  fs.lstat(fPath, function (errs, stat) {
    if (errs) throw errs
    if (stat.isFile()) {
      //  compressing...
      /* 重构数据结构
       * @return[{
         name: '',
         size: '',
         path: '',
         compressedSize: '',
         compressedPath: ''
        }]
       */
      let minName
      minName = pathLink(fPath, false)
      // 这里的作用是排除以'.'开头的系统文件等
      if (!nameReg.test(minName)) {
        renderArr.push({
          name: minName,
          size: stat.size,
          path: `${fPath}`,
          compressedSize: null,
          compressedPath: null
        })
        FILENUM = renderArr.length
      }
      eventReply.sender.send('filesList', renderArr)

      // 重新生成的新名字及其路径
      let generatePath = `${targetPath}/${minName.split('.')[0]}.min.${minName.split('.')[1]}`
      // tinypng api
      tinify
        .fromFile(path.resolve(fPath))
        .toFile(
          generatePath,
          () => {
            FINISHEDFILENUM += 1
            // 得到压缩后文件的size和path，推到原有数组里
            if (!nameReg.test(minName)) {
              fs.lstat(generatePath, function (errDoneFile, doneFileStat) {
                if (errDoneFile) throw errDoneFile
                if (FINISHEDFILENUM >= 0) {
                  for (let item of renderArr) {
                    if (item.name === minName) {
                      item.compressedSize = doneFileStat.size
                      item.compressedPath = targetPath
                    }
                  }
                  eventReply.sender.send('finishedItem', renderArr)
                }
              })
            }
            // TODO sync压缩
            if (FILENUM === FINISHEDFILENUM) {
              let targetPathArr = targetPath.split('/')
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
                  // eventReply.sender.send('dragEventReply', true)
                  // TODO 打完压缩包后删除目标文件夹
                  // rebuildTarget(targetPath, event, true);
                })
              })
            }
          }
        )
    } else if (stat.isDirectory()) {
      FINISHEDFILENUM -= 1
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
function rebuildTarget (target, event, del) {
  // 这两行是初始化列表
  renderArr = []
  // 删除已有文件夹 如果不存在则先生成
  fs.readdir(target, '', (err, files) => {
    if (err) throw err
    if (files.length > 0) {
      files.map(file => {
        fs.unlinkSync(`${target}/${file}`, err => {
          if (err) throw err
        })
      })
    }
    fs.rmdir(target, errs => {
      if (errs) throw errs
      if (!del) {
        fs.mkdir(target, err => {
          if (err) throw err
          readFPath(sourcePath, event)
        })
      }
    })
  })
}
