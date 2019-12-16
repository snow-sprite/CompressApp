import tinify from 'tinify'
let reg = new RegExp('windows', 'gi')

export const pathLink = (link, flag) => {
  // 输入path或者link 根据flag截取对应的图片名称
  let nameArrLeng
  let tName = ''
  if (reg.test(process.env.OS)) {
    // windows OS
    link = link.replace(/\\/g, '\\')
    nameArrLeng = link.split('\\').length
    tName = link.split('\\')[nameArrLeng - 1]
  } else {
    // mac OS
    nameArrLeng = link.split('/').length
    tName = link.split('/')[nameArrLeng - 1]
  }
  // flag: { true } 生成xx.min.xxx格式图片 否则输出原名程
  tName = flag ? `${tName.split('.')[0]}.min.${tName.split('.')[1]}` : tName
  return tName
}

export const validityApi = () => {
  // Validation of API key failed.
  return new Promise((resolve, reject) => {
    tinify.validate(function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export const downloadPath = () => {
  // 输出下载目录
  var onlineCompressTarget = ''
  if (reg.test(process.env.OS)) {
    // windows OS
    onlineCompressTarget = `C:\\Users\\Administrator\\Downloads\\`
  } else {
    // mac OS
    onlineCompressTarget = `/Users/${process.env.LOGNAME}/Downloads/`
  }
  return onlineCompressTarget
}
