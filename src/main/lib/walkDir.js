import fs from 'fs'
import path from 'path'

/**
 * 遍历源目标， 生成对应的目标文件夹
 * @params isSingle 在一次性上传多内容时 需要动态生成文件夹时用到
 */
export const walkDir = (sPath, sourcePath, targetPath, isSingle) => {
  // 遍历文件夹
  if (fs.statSync(sPath).isDirectory()) {
    // 针对windows系统遍历数组生成对应目录 Created by Cid 2020/7/3
    generateDir(targetPath)
    let files = fs.readdirSync(sPath)
    for (let file of files) {
      let fileTemp = path.join(sPath, file)
      let fileStat = fs.statSync(fileTemp)
      if (fileStat.isDirectory()) {
        walkDir(fileTemp, sourcePath, targetPath, isSingle)
      } else if (fileStat.isFile()) {
        // 如果是文件 保存对应的文件夹
        let targetDirPath
        if (isSingle) {
          // 单文件夹直接使用传入的目录即可
          let sourceDirPath = path.dirname(fileTemp)
          let sourceTempPath = sourcePath.length
          targetDirPath = path.join(targetPath, sourceDirPath.slice(sourceTempPath))
        } else {
          // 多内容时 使用源目录截取获取目标目录
          let sourceTempPath = path.dirname(sourcePath).length
          targetDirPath = path.join(targetPath, sPath.slice(sourceTempPath))
        }

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
