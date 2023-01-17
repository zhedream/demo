function readTextFileBase64(file) {
  let p1 = readAsTextByEncoding(file, "utf-8");
  let p2 = readAsTextByEncoding(file, "gbk"); // gbk = gb2312
  return Promise.all([p1, p2])
    .then(([utf8, gbk]) => {
      let text = "";
      if (utf8.indexOf("�") === -1) {
        text = utf8;
      } else if (gbk.indexOf("�") === -1) {
        text = gbk;
      } else {
        return Promise.reject("文件编码错误");
      }
      const blob = new Blob([text], { type: "text/plain" });
      const reader = new FileReader();
      return new Promise((res, rej) => {
        reader.onload = () => {
          res(reader.result);
        };
        reader.onerror = (err) => {
          rej(err);
        };
        reader.readAsDataURL(blob);
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function textFileAutoEncoding(file) {
  let p1 = readAsTextByEncoding(file, "utf-8");
  let p2 = readAsTextByEncoding(file, "gbk"); // gbk = gb2312
  return Promise.all([p1, p2])
    .then(([utf8, gbk]) => {
      let text = "";
      if (utf8.indexOf("�") === -1) {
        text = utf8;
      } else if (gbk.indexOf("�") === -1) {
        text = gbk;
      } else {
        return Promise.reject("文件编码错误");
      }
      const blob = new Blob([text], { type: "text/plain" });
      return new File([blob], file.name, { type: "text/plain" });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function readAsTextByEncoding(file, encoding = "utf-8") {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function (e) {
      console.log("error: ", e);
      rej(e);
    };
    reader.readAsText(file, encoding);
  });
}
