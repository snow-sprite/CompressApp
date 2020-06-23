# Compress your images

> A compressed picture desktop program based on electron-vue

Typescript版本：<https://github.com/snow-sprite/TsCompressApp>

#### Local

- [x] 单文件夹（生成到当前目录以_compressed结尾的新文件夹下，并打包zip）
- [x] 单图片 （生成到当前图片目录下对应的.min图片）
- [x] 多图片 （生成到当前目录以imgs_compressed结尾的新文件下，并打包zip）
- [ ] 多文件夹 （生成到当前目录以dirs_compressed结尾的新文件下，并打包zip）
- [ ] 文件夹及图片 （生成到当前目录以dirs_images_compressed结尾的新文件下，并打包zip）

#### Online

- [x] 仅支持有后缀的在线图片，默认生成到系统【下载】文件夹下

### 更新信息写到根目录updateInfo.json中即可，键值可以随便填
 - demo
 ```
  {
    "abc": "首页左下角新增版本信息",
    "012": "新增版本更新简介"
  }
 ```

#### sample graph

![Local](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/demo/Local.min.png)

![Online](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/demo/Online.min.png)

![Settings](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/demo/Settings.min.png)
![Compressed](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/demo/Compressed.min.png)

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# rebuild electron application for production
npm run build:clean && npm run build

```
---
