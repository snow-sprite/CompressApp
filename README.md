# Compress your images

> A compressed picture desktop program based on electron-vue

#### Local

- [x] 单文件夹（生成到当前目录以_compressed结尾的新文件夹下，并打包zip）
- [x] 单图片 （生成到当前图片目录下对应的.min图片）
- [x] 文件夹及图片 （生成到当前目录以dirs_images_compressed结尾的新文件下，并打包zip）
- [x] 多图片 （生成到当前目录以imgs_compressed结尾的新文件下，并打包zip）
- [x] 多文件夹 （生成到当前目录以dirs_compressed结尾的新文件下，并打包zip）

#### Online

- [x] 仅支持有后缀的在线图片，默认生成到系统【下载】文件夹下

#### sample graph

![local](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/build/demo/local.min.png)

![online](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/build/demo/online.min.png)

![settings](https://raw.githubusercontent.com/snow-sprite/CompressApp/master/build/demo/settings.min.png)

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

#### demo (download the app then run build)
> CompressApp/build/mac/Compress your images.app

---