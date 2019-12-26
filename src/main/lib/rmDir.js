const fs = require('fs')
const path = require('path')

// 删除指定目标文件夹
export const reBuildDir = sPath => {
  // 目标目录存在 开始执行
  if (fs.existsSync(sPath)) {
    let sPathFiles = fs.readdirSync(sPath)
    sPathFiles.forEach(file => {
      // 把当前文件的绝对路径传
      let fileWithPath = path.join(sPath, file)
      let fileWithPathStat = fs.statSync(fileWithPath)
      if (fileWithPathStat.isDirectory()) {
        reBuildDir(fileWithPath)
      } else if (fileWithPathStat.isFile()) {
        fs.unlinkSync(fileWithPath)
      }
    })
    fs.rmdirSync(sPath)
  }
}
