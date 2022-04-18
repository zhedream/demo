const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

/* =============================HS256========================================= */
var token = jwt.sign({ foo: 'bar' }, 'pwd'); // 签名
// 验证签名1 同步
try {
    var decoded = jwt.verify(token, 'wrong-secret');
    console.log(decoded);
  } catch(err) {
      console.log('同步验签失败');
  }

// 验证签名2 异步
jwt.verify(token, 'pwd', function(err, decoded) {
    if(!err){
    console.log(decoded.foo) // bar
    }else{
        console.log('异步验签失败',err);
    }
  });


/* ================================== RS256 ======================================= */
/* 
  选择当前目录 生成 密匙对
  ssh-keygen -m PEM -t rsa -b 2048 -f private.key
  openssl rsa -in private.key -pubout -outform PEM -out public.key
 */


var private = fs.readFileSync(path.resolve(__dirname,'private.key'));  // get private key
var public = fs.readFileSync(path.resolve(__dirname,'public.key'));  // get public key
var token = jwt.sign({ foo: 'bar' }, private, { algorithm: 'RS256' });
console.log(token);

// // 异步签名
// jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function (err, token) {
//   console.log(token);
// });

jwt.verify(token, public, function (err, decoded) {
  if (err) {
    console.log('验签失败');
  } else {
    console.log(decoded);
  }
});
/* 
token 本身没有加密的,  任何人都可以解码出,载体内容, 所以不要将秘密写进 载体里.  jwt 只是把载体内容 转码, 便于传输, 保存, 并做了一个签名, 可以验证篡改问题.   

jsonwebtokoen npm 官方示例.
LINK : https://www.npmjs.com/package/jsonwebtoken
*/