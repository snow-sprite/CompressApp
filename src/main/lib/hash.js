const baseMap = []
// 26个英文字符 [a-z] + [A-Z] + [1-26]
const HASH_LENGTH = 26
for (let i = 0; i < HASH_LENGTH; i++) {
  baseMap.push(String.fromCharCode(65 + i))
  baseMap.push(String.fromCharCode(97 + i))
  baseMap.push(1 + i)
}

let hashMap = []
// 生成的hash长度 默认：6
const HASH_SIZE = 6
const generateHash = _ => {
  // 重置一下 防止新生成的hash串与已有hash串合并
  hashMap = []
  for (let j = 0; j < HASH_SIZE; j++) {
    hashMap.push(baseMap[Math.floor(Math.random() * HASH_LENGTH)])
  }
  return hashMap.join('')
}

export default generateHash
