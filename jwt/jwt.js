var fs = require ('fs');
const jwt = require('jsonwebtoken');

// var token = jwt.sign({ foo: 'bar' }, 'pwd'); // 签名
// // 验证签名1 同步
// try {
//     var decoded = jwt.verify(token, 'wrong-secret');
//     console.log(decoded);
//   } catch(err) {
//       console.log('同步验签失败');
//   }

// // 验证签名2 异步
// jwt.verify(token, 'pwd', function(err, decoded) {
//     if(!err){
//     console.log(decoded.foo) // bar
//     }else{
//         console.log('异步验签失败',err);
//     }
//   });

  /* 
    选择当前目录 生成 密匙对
    ssh-keygen -t rsa -b 2048 -f private.key
    openssl rsa -in private.key -pubout -outform PEM -out public.key
   */


  var cert = fs.readFileSync('private.key');  // get private key
  var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});
console.log(token);

// // 异步签名
// jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
//     console.log(token);
//   });

//   jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
//     // if jwt id mismatch, err == invalid jwt id
//   });

// console.log(token);




