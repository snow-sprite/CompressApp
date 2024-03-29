# Compress your images

[English](./README.md) | 简体中文

> 一款基于electron-vue的图片压缩桌面程序

<p align="center">
  <a href="https://github.com/snow-sprite/CompressApp/stargazers" target="_blank">
    <img alt="stars" src="https://img.shields.io/github/stars/snow-sprite/CompressApp?color=success&logo=github&style=flat-square" />
  </a>

  <a href="https://github.com/snow-sprite/CompressApp/network/members" target="_blank">
    <img alt="forks" src="https://img.shields.io/github/forks/snow-sprite/CompressApp?color=yellow&logo=github&style=flat-square" />
  </a>

  <a href="https://github.com/snow-sprite/CompressApp/issues" target="_blank">
    <img alt="issues" src="https://img.shields.io/github/issues/snow-sprite/CompressApp?color=important&logo=Issuu&logoColor=white&style=flat-square" />
  </a>
</p>

Typescript版本：<https://github.com/snow-sprite/TsCompressApp>

#### Local 🚀🚀

支持：
- [x] 单文件夹
- [x] 单图片
- [x] 多图片
- [x] 多文件夹 
- [x] 文件夹及图片
- [x] 非支持格式的文件原样拷贝到目标目录

#### Online 🚅🚅

- [x] 仅支持有后缀的在线图片，默认生成到系统【下载】文件夹下

#### Rename ✏️✏️
批量重命名文件后缀(如将.jpg转换为.png格式的，只支持单文件夹)

### 更新信息写到根目录updateInfo.json中即可，键值可以随便填
 - demo 🍐🍐
 ```
  {
    "更新1": "修复windows环境下下载地址错误",
    "update2": "新增批量重命名功能",
    "c": 'xxx...'
  }
 ```

### TODO 🕞🚦🚧
- [ ] 添加一个国内的压缩api（tinypng api太慢了）

#### sample graph 📌📌

<!-- ![Local](https://github.com/snow-sprite/CompressApp/blob/master/demo/Local.min.png?raw=true)

![Online](https://github.com/snow-sprite/CompressApp/blob/master/demo/Online.min.png?raw=true)

![Settings](https://github.com/snow-sprite/CompressApp/blob/master/demo/Settings.min.png?raw=true)

![Compressed](https://github.com/snow-sprite/CompressApp/blob/master/demo/Compressed.min.png?raw=true) -->
<span><img align="center" alt="Local" title="Local" src="https://github.com/snow-sprite/CompressApp/blob/master/demo/Local.min.png?raw=true" width="400px" /></span>
<span><img align="center" alt="Online" title="Online" src="https://github.com/snow-sprite/CompressApp/blob/master/demo/Online.min.png?raw=true" width="400px" /></span>
<span><img align="center" alt="Settings" title="Settings" src="https://github.com/snow-sprite/CompressApp/blob/master/demo/Settings.min.png?raw=true" width="400px" /></span>
<span><img align="center" alt="Compressed" title="Compressed" src="https://github.com/snow-sprite/CompressApp/blob/master/demo/Compressed.min.png?raw=true" width="400px" /></span>
<span><img align="center" alt="Rename" title="Compressed" src="https://github.com/snow-sprite/CompressApp/blob/master/demo/Rename.min.png?raw=true" width="400px" /></span>
#### Donate
> If you find this project useful, you can buy author a glass of ~~tea~~ ~~coffee~~ ~~beer~~ juice.

<span><img align="center" alt="WeChat" title="WeChat" src="https://raw.githubusercontent.com/snow-sprite/picGoPublic/master/github-imgs/wechat.png" width="300px" height="300px" /></span>
<span><img align="center" alt="Alipay" title="Alipay" src="https://raw.githubusercontent.com/snow-sprite/picGoPublic/master/github-imgs/alipay.png" width="300px" height="300px" /></span>



#### Build Setup ✒✒

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
