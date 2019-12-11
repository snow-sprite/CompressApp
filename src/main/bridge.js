const {
  ipcMain
} = require('electron')

const tinify = require('tinify')
const fs = require('fs')
const path = require('path')
const zipper = require('zip-local')
const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN"
tinify.key = API_KEY

// 源文件夹
var sourcePath = ''
// 目标文件夹
var targetPath = ''
// 文件数量
var FILENUM = 0
// 已压缩文件数
var FINISHEDFILENUM = 0

// 渲染的图片列表
let renderArr = []
ipcMain.on('dragEventMessage', function(event, fPath) {
  sourcePath = fPath
  targetPath = path.resolve(`${fPath}-compresed`);
  compresePic(event);
  // event.reply('dragEventReply', arg)
})

// 读取文件夹
function readFPath(fPath, eventReply) {
  fs.lstat(fPath, function(errs, stat) {
    if (errs) throw errs;
    if (stat.isFile()) {
      FILENUM += 1;
      //  compressing...
      let minNameArrLeng = fPath.split("/").length;
      let minName = fPath.split("/")[minNameArrLeng - 1];
      renderArr.push({
        name: minName,
        path: `${fPath}`
      })
      eventReply.reply('filesList', renderArr)
      // tinypng api
      // tinify
      //   .fromFile(path.resolve(fPath))
      //   .toFile(
      //     `${targetPath}/${minName.split(".")[0]}.min.${minName.split(".")[1]}`,
      //     () => {
      //       FINISHEDFILENUM += 1;
      //       // TODO sync压缩
      //       if (FILENUM === FINISHEDFILENUM) {
      //         let targetPathArr = targetPath.split("/");
      //         let targetFileName = targetPathArr[targetPathArr.length - 1];
      //         let newTargetPath = targetPath.replace(
      //           targetPathArr[targetPathArr.length - 1],
      //           ""
      //         );
      //         zipper.zip(targetPath, function(errZip, zipped) {
      //           if (errZip) throw errZip;
      //           zipped.compress();
      //           zipped.save(`${newTargetPath}${targetFileName}.zip`, function(
      //             errSave
      //           ) {
      //               if (errSave) throw errSave;
      //               eventReply.reply("dragEventReply", true);
      //               // TODO 打完压缩包后删除目标文件夹
      //               // rebuildTarget(targetPath, event, true);
      //             });
      //         });
      //       }
      //     }
      //   );
    } else if (stat.isDirectory()) {
      // read dir...
      fs.readdir(fPath, function(errDir, files) {
        if (errDir) throw errDir;
        for (file of files) {
          readFPath(path.join(fPath, file), eventReply);
        }
      });
    }
  });
}

// 重构目标目录
function compresePic(event) {
  // comprese image..
  try {
    fs.access(targetPath, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(targetPath, () => {
          rebuildTarget(targetPath, event);
        });
      } else {
        rebuildTarget(targetPath, event);
      }
    });
  } catch (error) {
    throw error;
  }
}

// 重构目标文件
function rebuildTarget(target, event, del) {
  renderArr = []
  fs.readdir(target, "", (err, files) => {
    if (err) throw err;
    if (files.length > 0) {
      files.map(file => {
        fs.unlinkSync(`${target}/${file}`, err => {
          if (err) throw err;
        });
      });
    }
    fs.rmdir(target, errs => {
      if (errs) throw errs;
      if (!del) {
        fs.mkdir(target, err => {
          if (err) throw err;
          readFPath(sourcePath, event);
        });
      }
    });
  });
}