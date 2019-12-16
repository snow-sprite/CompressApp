const filters = {
  sizeFormat (size) { // 转换字节
    if (!size) return size
    if (size >= 1000000) {
      size = `${(size / 1000000).toFixed(2)} MB`
    } else if (size >= 1000) {
      size = `${(size / 1000).toFixed(2)} KB`
    } else if (size < 1000) {
      size = `${size.toFixed(2)} B`
    }
    return size
  }
}

export default filters
