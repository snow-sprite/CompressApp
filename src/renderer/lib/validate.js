import tinify from 'tinify'

export const validityApi = () => {
  // Validation of API key failed.
  return new Promise((resolve, reject) => {
    tinify.validate(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
