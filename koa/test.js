import fetch from 'node-fetch';

// fetch("http://172.16.9.149:2020/tianditu_gov_cn/img_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=img&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX=12&TILEROW=1674&TILECOL=3417&tk=85c9d12d5d691d168ba5cb6ecaa749eb", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "omit"
// })

//   .then(e => e)
//   .then(res => {
//     console.log('res1: ', res.status);
//     console.log('res1: ', res.headers.get('content-type'));
//   })

// fetch("http://172.16.9.149:8080/tianditu_gov_cn/img_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=img&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX=12&TILEROW=1674&TILECOL=3417&tk=85c9d12d5d691d168ba5cb6ecaa749eb", {
// })
fetch("http://127.0.0.1:3001/getImage", {
})
  .then(e => e)
  .then(res => {
    console.log('res2: ', res.status);
    console.log('res2: ', res.headers.get('content-type'));

  })

// fetch("http://172.16.9.149:2020/tianditu_gov_cn/cia_w/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX=13&TILEROW=3101&TILECOL=6741&tk=85c9d12d5d691d168ba5cb6ecaa749eb",
// )

//   .then(e => e)
//   .then(res => {
//     console.log('res2: ', res.status);
//     console.log('res2: ', res.headers.get('content-type'));
//     res.json().then(j => {
//       console.log('j: ', j);

//     })
//   })