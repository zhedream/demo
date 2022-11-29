// let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// function chunk(list, size) {
//   let chunks = [];
//   for (let i = 0; i < list.length; i += size) {
//     chunks.push(list.slice(i, i + size));
//   }
//   return chunks;
// }
// const rgblist = chunk(list, 3);
// console.log(rgblist);


// let colorWidth = 3;
// let rOffset = 0;
// let gOffset = 1;
// let bOffset = 2;

// let colorIndex = 0;

// let r = list[colorIndex * colorWidth + rOffset];
// let g = list[colorIndex * colorWidth + gOffset];
// let b = list[colorIndex * colorWidth + bOffset];




let a = [
  [0, 0, [1, 2, 3]],
  [0, 1, [1, 2, 3]],
  [0, 2, [1, 2, 3]],
];

a = a.flatMap(([x, y, [r, g, b]]) => [x, y, r, g, b]);
console.log('a: ', a);

let pointWidth = 5;
let pointXOffset = 0;
let pointYOffset = 1;
let pointColorOffset = 2;


let pointIndex = 0;

let pointHead = pointIndex * pointWidth;
let colorHead = pointHead + pointColorOffset;

let colorWidth = 3;
let rOffset = 0;
let gOffset = 1;
let bOffset = 2;

let r = a[colorHead + rOffset];
console.log('r: ', r);

