import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();

const proxy = "http://127.0.0.1:7890";
const agent = new HttpsProxyAgent(proxy);

app.get("/", (req, res) => {
  // res.json(req.headers);
  // return

  // 获取 x y z 参数
  const { x, y, z } = req.query;

  console.log("x, y, z: ", x, y, z);

  if (!x || !y || !z) {
    res.sendStatus(400);
    return;
  }

  getImage(`https://khms0.google.com/kh/v=942?x=${x}&y=${y}&z=${z}`)
    .then((image) => {
      res.set("Content-Type", "image/png"); // 设置响应头
      res.send(image); // 返回图像
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

function getImage(url) {
  return fetch(url, { agent: agent })
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer));
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
