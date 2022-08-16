import fs from 'fs'
import path from 'path'
import {
  ipcMain
} from 'electron'

// 事件回复通道
let eventReplay = null
let totalCount = 0
let finishCount = 0
ipcMain.on('uploadMultipleRenames', (mainEvent, filePath, oldSuffix, newSuffix) => {
  filePath += path.sep
  console.log('filePath', filePath)
  eventReplay = eventReplay ? mainEvent : eventReplay
  getChangeFiles(filePath, `.${oldSuffix}`, `.${newSuffix}`)
})

// 批量重命名
function getChangeFiles (filePath, oldSuffix, newSuffix) {
  readFileList(filePath).forEach((item) => {
    let lowerOldSuffer = path.extname(item.filename).toLowerCase()
    if (lowerOldSuffer === oldSuffix.toLowerCase()) {
      totalCount += 1

      let oldfilePath = item.filePath + item.filename.toLowerCase()
      let newSuffixFile = item.filename.toLowerCase().split(oldSuffix.toLowerCase())[0]
      let newfilePath = item.filePath + newSuffixFile + newSuffix
      rename(oldfilePath, newfilePath)
    }
  })
}

// 读取文件列表
function readFileList (filePath, filesList) {
  filesList = filesList || []
  let files = fs.readdirSync(filePath)
  files.forEach(function (filename, index) {
    // 判断是不是目录
    if (fs.statSync(filePath + filename).isDirectory()) {
      // 递归读取文件
      readFileList(`${filePath}${filename}/`, filesList)
    } else {
      filesList.push({
        filePath,
        filename
      })
    }
  })
  return filesList
}

// 批量重写文件名称
function rename (oldfilePath, newfilePath) {
  fs.rename(oldfilePath, newfilePath, function (err) {
    if (err) {
      throw err
    }
    finishCount += 1
    console.log('+++++++++++++++++++++++', totalCount, finishCount)
    if (totalCount === finishCount) {
      console.log('finished')
    }
  })
}
