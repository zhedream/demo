let arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50,
];

let count = (arr.length / (arr.length / 20)) | 0;

let arr1 = chunk(arr, count);

let arr2 = transpose(arr1);

console.log("arr2: ", arr2);

function chunk(arr, count) {
  let result = [];
  let i = 0;
  while (i < arr.length) {
    result.push(arr.slice(i, i + count));
    i += count;
  }
  return result;
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}
