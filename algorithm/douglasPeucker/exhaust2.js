// 摘自: https://blog.csdn.net/chaoyang89111/article/details/89456749


//计算距离
function calculationDistance(point1, point2) {
  let lat1 = point1.y;
  let lat2 = point2.y;
  let lng1 = point1.x;
  let lng2 = point2.x;
  let radLat1 = lat1 * Math.PI / 180.0;
  let radLat2 = lat2 * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = (lng1 * Math.PI / 180.0) - (lng2 * Math.PI / 180.0);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
    + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  return s * 6370996.81;
};
//计算垂距
function distToSegment(start, end, center) {
  //下面用海伦公式计算面积
  let a = Math.abs(calculationDistance(start, end));
  let b = Math.abs(calculationDistance(start, center));
  let c = Math.abs(calculationDistance(end, center));
  let p = (a + b + c) / 2.0;
  let s = Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)));
  return s * 2.0 / a;
};
//递归方式压缩轨迹
function compressLine(coordinate, result, start, end, dMax) {
  if (start < end) {
    let maxDist = 0;
    let currentIndex = 0;
    let startPoint = coordinate[start];
    let endPoint = coordinate[end];
    for (let i = start + 1; i < end; i++) {
      let currentDist = distToSegment(startPoint, endPoint, coordinate[i]);
      if (currentDist > maxDist) {
        maxDist = currentDist;
        currentIndex = i;
      }
    }
    if (maxDist >= dMax) {
      //将当前点加入到过滤数组中
      result.push(coordinate[currentIndex]);
      //将原来的线段以当前点为中心拆成两段，分别进行递归处理
      compressLine(coordinate, result, start, currentIndex, dMax);
      compressLine(coordinate, result, currentIndex, end, dMax);
    }
  }
  return result;
};
/**
 *
 *@param coordinate 原始轨迹Array<{latitude,longitude}>
 *@param dMax 允许最大距离误差
 *@return douglasResult 抽稀后的轨迹
 *
 */
function douglasPeucker(coordinate, dMax) {
  if (!coordinate || !(coordinate.length > 2)) {
    return null;
  }
  coordinate.forEach((item, index) => {
    item.key = index;
  });
  let result = compressLine(coordinate, [], 0, coordinate.length - 1, dMax);
  result.push(coordinate[0]);
  result.push(coordinate[coordinate.length - 1]);
  let resultLatLng = result.sort((a, b) => {
    if (a.key < b.key) {
      return -1;
    } else if (a.key > b.key)
      return 1;
    return 0;
  });
  resultLatLng.forEach((item) => {
    item.key = undefined;
  });
  return resultLatLng;
};



var points = [
  { x: 10, y: 10 },
  { x: 20, y: 30 },
  { x: 30, y: 12 },
  { x: 35, y: 5 },
  { x: 40, y: 22 },
  { x: 50, y: 12 },
  { x: 80, y: 40 }
];

var data = douglasPeucker(points, 14)
console.log('points: ', points);
console.log('data: ', data);
