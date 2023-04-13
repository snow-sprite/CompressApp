import fs from 'fs'
import path from 'path'
import {
  ipcMain
} from 'electron'

// 事件回复通道
let eventReply = null
let totalCount = 0
let finishCount = 0
ipcMain.on('uploadMultipleRenames', (mainEvent, filePath, oldSuffix, newSuffix) => {
  filePath += path.sep
  eventReply = mainEvent
  // 重置上一次默认数和完成数
  totalCount = 0
  finishCount = 0

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
  // 如果没执行重命名操作 也要记得重置input target.value值
  if (totalCount === 0) {
    finishCount = 0
    eventReply.sender.send('renameDone', finishCount)
  }

  // 此处汇总统计待重命名文件数
  eventReply.sender.send('renameing', totalCount)
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
    if (totalCount === finishCount) {
      eventReply.sender.send('renameDone', finishCount)
    }
  })
}
