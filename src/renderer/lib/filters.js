const filters = {
  sizeFormat (size) { // 转换字节
    if (!size) return size
    if (size >= (1024 * 1024)) {
      size = `${(size / 10204 / 1024).toFixed(2)} MB`
    } else if (size >= 1024) {
      size = `${(size / 1024).toFixed(2)} KB`
    } else if (size < 1024) {
      size = `${size.toFixed(2)} B`
    }
    return size
  }
}

export default filters
