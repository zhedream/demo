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

/**
 * @description 数组分页
 * @param {*} pageNo 页码
 * @param {*} pageSize 条数
 * @param {*} array 数组
 */
const paginationFromArray = (pageNo, pageSize, array) => {
  if (!array) return array;
  const offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
};

/**
 * 返回第几列
 * @param {*} count 当前第几个
 * @param {*} columnCount 一行几个
 * @return {number} 1 <= curColumn <= columnCount
 */
function whichColumn(count: number, columnCount: number) {
  const remainder = (count - 1) % columnCount; // 下标的余数
  const restCount = columnCount - remainder - 1; // 剩余的个数
  return columnCount - restCount; // 第几个
}

function whichRow(count: number, columnCount: number) {
  return Math.ceil(count / columnCount);
}

function whichXY(count: number, columnCount: number) {
  return [whichRow(count, columnCount), whichColumn(count, columnCount)];
}

/**
 * 获取行,所在页码
 * @param {*} dataIndex 数据行
 * @param {*} pageSize 数量
 * @returns [number,number] 页码 第几个
 */
export function getDataIndex(
  dataIndex: number,
  pageSize: number
): [number, number] {
  if (dataIndex == 0) return [0, 0];
  let page = 0;
  let count = 0;
  if (dataIndex % pageSize == 0) {
    page = dataIndex / pageSize;
    count = pageSize;
  } else {
    page = parseInt(String(dataIndex / pageSize)) + 1;
    count = dataIndex % pageSize;
  }
  return [page, count];
}
