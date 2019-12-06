// const {
//   ipcMain
// } = require('electron')

// const tinify = require('tinify')
// const fs = require('fs')
// const path = require('path')

// const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN"
// tinify.key = API_KEY


// var sourcePath = ''
// var targetPath = ''
// ipcMain.on('dragEventMessage', function(event, fPath) {
//   sourcePath = fPath
//   targetPath = path.join(`${fPath}-compresed`);
//   compresePic()
//   // readFPath(fPath)
//   // event.reply('dragEventReply', arg)
// })

// // 读取文件夹
// function readFPath(fPath) {
//   // console.log('fpath', fPath)
//   fs.lstat(fPath, function (errs, stat) {
//     if (errs) throw errs
//     if (stat.isFile()) {
// // success: /Users/ningzhou/workgroup/test/minify-your-img/source-compresed/avatar2.jpg/avatar2.min.jpg
// // success: /Users/ningzhou/workgroup/test/minify-your-img/source-compresed/img2/avatar3.jpg/avatar3.min.jpg
// // success: /Users/ningzhou/workgroup/test/minify-your-img/source-compresed/avatar.jpg/avatar.min.jpg
//       //  compressing...
//       let minNameArrLeng = fPath.split('/').length
//       let minName = fPath.split('/')[minNameArrLeng - 1]
//       let deepTargetPath = fPath.replace(sourcePath, "").slice(1);
//       // console.log("deepTargetPath", deepTargetPath)
//       tinify
//         .fromFile(path.resolve(fPath))
//         .toFile(
//           `${path.join(targetPath, deepTargetPath)}`,
//           () => {
//             console.log(
//               `success:`,
//               `${path.join(targetPath, deepTargetPath)}`
//             );
//           }
//         );
//     } else if (stat.isDirectory()) {
//       // read dir...
//       fs.readdir(fPath, function(errDir, files) {
//         if (errDir) throw errDir
//         for (file of files) {
//           readFPath(path.join(fPath, file))
//         }
//       })
//     }
//   })
// }

// // 重构目标目录
// function compresePic() {
//   // comprese image..
//   try {
//     fs.access(targetPath, fs.constants.F_OK, err => {
//       // if there's not a target dir, make it first.
//       if (err) {
//         fs.mkdir(targetPath, () => {
//           rebuildTarget(targetPath)
//         })
//       } else {
//         rebuildTarget(targetPath)
//       }
//     });
//   } catch (error) {
//     throw error
//   }
// }

// // 重构目标文件
// function rebuildTarget(target) {
//   fs.readdir(target, "", (err, files) => {
//     if (err) throw err;
//     if (files.length > 0) {
//       files.map(file => {
//         fs.unlinkSync(`${target}/${file}`, err => {
//           if (err) throw err;
//         });
//       });
//     }
//     fs.rmdir(target, errs => {
//       if (errs) throw errs;
//       fs.mkdir(target, err => {
//         if (err) throw err;
//         readFPath(sourcePath);
//       });
//     });
//   });
// }