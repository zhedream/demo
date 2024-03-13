function swap(arr, aIndex, bIndex) {
  let temp = arr[aIndex];
  arr[aIndex] = arr[bIndex];
  arr[bIndex] = temp;
}

function quckSort(arr) {
  quick(arr, 0, arr.length - 1);
}

function quick(arr, begin, end) {
  if (begin >= end) return;
  let left = begin;
  let right = end + 1;
  // console.log("start", begin, end);
  do {
    while (left < right && arr[++left] <= arr[begin]);

    while (right > left && arr[--right] >= arr[begin]);

    // if (left < right) {
    console.log(`${left},${right}swap1`, arr[left], arr[right]);
    swap(arr, left, right);
    console.log(arr);
    // }
  } while (left < right);

  let mid = left - 1; // == right ? left - 1 : left;

  // console.log(`${left}, ${right}, ${mid}swap2 `, arr[left], arr[right], arr[mid]);
  // console.log(`${begin}, ${mid} swap3 `, arr[begin], arr[mid]);

  // if (i > begin) {
  swap(arr, begin, mid);
  // console.log(arr);
  // }

  quick(arr, begin, mid - 1);
  quick(arr, mid + 1, end);
}

var arr = [10, 4, 9, 13, -1, 6, 5, 1, 7, 3, 2]; // 1 8
// var arr = [4, 2, 3, 6, 5, 1, 7, 8, 9]; // 2 7
// var arr = [4, 2, 3, 6, 5, 1, 7, 8, 9]; // 3 6
var arr = [6, 10, 11, 11, 18, 20];
var arr = [3, 3, 1, 9, 7, 5, 8, 4, 8];

console.log(arr);
quckSort(arr);
console.log("---------------");
console.log(arr);

// 快速排序
function quickSort(arr, left, right) {
  if (left < right) {
    let pivot = partition(arr, left, right);
    quickSort(arr, left, pivot - 1);
    quickSort(arr, pivot + 1, right);
  }
}
function partition(arr, left, right) {
  let pivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] >= pivot) right--;
    arr[left] = arr[right];
    while (left < right && arr[left] <= pivot) left++;
    arr[right] = arr[left];
  }
  arr[left] = pivot;
  return left;
}
