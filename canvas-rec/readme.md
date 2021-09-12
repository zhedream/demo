# 浏览器录屏

需求背景: 地图 arcgis for js, 3D/2D 轨迹回放+联动信息图表 的录制

浏览器 echart , arcgis for js

webgl 上下文太多导致丢失

git bash , 自带 openssl

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

## webpack

https://webpack.docschina.org/configuration/dev-server/#devserverhttps

## 屏幕捕捉 API

https://developer.mozilla.org/zh-CN/docs/Web/API/Screen_Capture_API

## HTTPS

安装 choco
choco install mkcert

```bash as admin
choco install mkcert -y
mkcert -install 安装 CA 服务
```

```bash
mkcert 127.0.0.1

http-server -S
http-server -S -C 127.0.0.1.pem -K 127.0.0.1-key.pem

```

CA 证书目录
C:\Users\Administrator\AppData\Local\mkcert

## 录制 canvas

给 Canvas 录制一个视频
https://juejin.im/post/6844903944867561479

分享一个 canvas 录屏的方案
https://zhuanlan.zhihu.com/p/71528138

## 合并 canvas 录制

f.html

## webm 不能快进

https://bgrins.github.io/videoconverter.js/demo/

-i input.webm -vcodec copy -acodec copy output.webm

https://js-video-converter.com/zh/

-i INPUT -vcodec copy -acodec copy output.webm

## 参考

1. JavaScript 屏幕录制 API 学习
   https://segmentfault.com/a/1190000020266708

1. I do not have have access to navigator.mediaDevices when the site is deployed. How do I fix this?
   https://stackoverflow.com/questions/56623954/i-do-not-have-have-access-to-navigator-mediadevices-when-the-site-is-deployed-h

1. 使用 http-server 在本地开启 https 服务
   https://www.jianshu.com/p/7895c57a321c

1. 配置 HTTPS 证书后，浏览器出现不安全提示的解决方法
   https://blog.csdn.net/AllisWell_Wotrus/article/details/93058704

1. 如何将证书导入到“受信任的根证书颁发机构”存储区中
   https://blog.csdn.net/luyangbin01/article/details/50972693

1. 教你秒建受信任的本地 SSL 证书，彻底解决开发测试环境的无效证书警告烦恼！
   https://blog.csdn.net/easylife206/article/details/101443143

1. mkcert 在 windows 系统上制作 SSL 证书
   https://chaihongjun.me/os/windows/292.html

1. TERMINAL DEMO 视频转换 videoconverter
   https://bgrins.github.io/videoconverter.js/demo/

1. FFmpeg
   https://github.com/FFmpeg/FFmpeg

1. Webm 进度条问题分析与解决
   https://juejin.im/post/6844903847974928397

1. videoconverter.js 浏览器上使用 js 进行视频格式转换，支持视频转 mp4、gif，视频截图
   http://one.bfw.wiki/plugin/15605066099202170025.html
1. JS 中的 Blob 和 ArrayBuffer
   https://www.jianshu.com/p/54d878aa0237

1. ArrayBuffer，二进制数组
   https://zh.javascript.info/arraybuffer-binary-arrays

1. DataURL 与 File,Blob,canvas 对象之间的互相转换的 Javascript
   https://blog.csdn.net/cuixiping/article/details/45932793

1. Canvas 中利用绘制 Video 标签实现视频的播放 | 知乎
   https://zhuanlan.zhihu.com/p/61336523

1. canvas 绘制 video
   https://www.cnblogs.com/xiaobaibubai/p/6945709.html

1. 「web 前端」将 Canvas 绘制过程转为视频
   https://blog.csdn.net/weixin_49473712/article/details/107911782

1. 如何合并多个 canvas 的内容
   https://bbs.csdn.net/topics/391039251

1. 二进制数据、编码
   https://zhuanlan.zhihu.com/p/27435098

## canvas <==> 视频

多媒体自动播放限制 必须由用户 click 点击事件触发 play()

canvas.caputer

requestAnimationFrame/cancelAnimationFrame

## blob arrayBuffer

blob <==> arrayBuffer: Int8Array | Uint8Array

blob 馒头

arrayBuffer 面粉

```js
buff = await blob.arrayBuffer(); // 馒头还原面粉
unit8Arr = new Uint8Array(buff); // 格式

var blob = new Blob([buff]);
var blob = new Blob([buff], { type: "image/jpeg; charset=utf-8" });
var blob = new Blob([buff], { type: "video/webm; charset=utf-8" });

var src = window.URL.createObjectURL(blob);
window.open(src);

let data = Uint8Array.from([1, 2, 3, 4]);
var foobar = data.subarray(0, 2);
var arrayBuffer = foobar.buffer;
// --
var aa = Uint8Array.from([97, 98]); // 片段1
var bb = Uint8Array.from([99, 100]); // 片段2
var bb = new Blob([aa, bb]);
bb.text(); // abcd

// --

btoa("a"); // YQ==   , 字符串到 base64
atob("YQ=="); // a   , 字符串到 base64

// -- node
console.log(Buffer.from("a").toString("base64"));
console.log(JSON.stringify(Buffer.from("ab")));
```
