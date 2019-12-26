import os from 'os'

export const pathLink = (link) => {
  // 输入path 根据flag截取对应的图片名称
  let nameArrLeng
  let tName = ''
  nameArrLeng = link.split('/').length
  tName = link.split('/')[nameArrLeng - 1]

  // 生成xx.min.xxx格式图片
  tName = `${tName.split('.')[0]}.min.${tName.split('.')[1]}`
  return tName
}

export const downloadPath = () => {
  // 输出下载目录
  var onlineCompressTarget = ''
  if (os.type() === 'Windows_NT') {
    // windows OS
    onlineCompressTarget = `C:\\Users\\Administrator\\Downloads\\`
  } else {
    // mac OS
    onlineCompressTarget = `/Users/${process.env.LOGNAME}/Downloads/`
  }
  return onlineCompressTarget
}
