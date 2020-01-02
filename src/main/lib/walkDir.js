import fs from 'fs'
import path from 'path'
// 遍历源目标，生成对应的目标文件夹
export const walkDir = (sPath, sourcePath, targetPath) => {
  // 遍历文件夹
  if (fs.statSync(sPath).isDirectory()) {
    let files = fs.readdirSync(sPath)
    for (let file of files) {
      let fileTemp = path.join(sPath, file)
      let fileStat = fs.statSync(fileTemp)
      if (fileStat.isDirectory()) {
        walkDir(fileTemp, sourcePath, targetPath)
      } else if (fileStat.isFile()) {
        // 如果是文件 保存对应的文件夹
        let sourceDirPath = path.dirname(fileTemp)
        let sourceTempPath = sourcePath.length
        let dest = sourceDirPath.slice(sourceTempPath)
        let targetDirPath = path.join(targetPath, dest)
        generateDir(targetDirPath)
      }
    }
  }
}

function generateDir (targetDir) {
  // 同步生成目标文件夹
  if (!fs.existsSync(targetDir)) {
    fs.mkdir(targetDir, err => {
      if (err && err.code === 'EEXIST') {
        return false
      }
    })
  }
}
