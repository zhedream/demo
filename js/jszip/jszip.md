# jszip

github: https://github.com/Stuk/jszip

https://stuk.github.io/jszip/

A library for creating, reading and editing .zip files with JavaScript, with a lovely and simple API.

npm install jszip

```js
import saveAs from "file-saver";
import JSZip from "jszip";

var zip = new JSZip();

zip.file("Hello.txt", "Hello World\n");

var img = zip.folder("images");
img.file("smile.gif", imgData, { base64: true });

zip.generateAsync({ type: "blob" }).then(function (content) {
  // see FileSaver.js
  saveAs(content, "example.zip");
});
```

## 链接

1. jszip 官方文档
   https://stuk.github.io/jszip/documentation/api_jszip/file_data.html

2. JSZip 库的简单使用
   https://www.jianshu.com/p/2689a38cf643

3. 如何使用 JSZip(How to use JSZip)
   https://blog.csdn.net/sujun10/article/details/76038886
