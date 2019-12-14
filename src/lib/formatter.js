import tinify from 'tinify'

export const pathLink = (link, flag) => {
  let nameArrLeng
  let tName = ''
  let reg = new RegExp('windows', 'gi')
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
