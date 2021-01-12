
/**
 * 时间规整
 * @param {*} $time 待规整时间
 * @param {*} $jiange 规整间隔 @$multiple
 * @param {*} $startTime 基准时间
 * @param {*} $offset 偏移(秒) @$multiple
 * @param {*} $multiple 倍数, 1000->秒
 */
function getTimeFloor($time, $jiange, $startTime = null, $offset = 0, $multiple = 1000) {
  // FIXME: 待规整时间 小于 基准时间,@bug? . [呈现以$startTime对称对分布]  (大于基准时间正常)
  const baseTime = new Date($startTime).getTime();
  const subTime = new Date($time).getTime() - baseTime;
  const $count = parseInt(subTime / $jiange / $multiple);
  return new Date($count * $jiange * $multiple + baseTime + ($offset * $multiple));
}

// {
//   // 待规整时间 > 基准时间
//   for (let index = 0; index < 10; index++) {
//     const time = new Date('2019-10-25 12:04:57').getTime() + index * 1000;
//     console.log(getTimeFloor(time, 3, '2019-10-25 12:04:56'))
//   }
// }

// {
//   // 待规整时间 < 基准时间  有bug
//   for (let index = 0; index < 10; index++) {
//     const time = new Date('2019-10-25 12:04:50').getTime() + index * 1000;
//     console.log(getTimeFloor(time, 3, '2019-10-25 12:04:56'))
//   }
// }

a: {
  // break a;
  $arr = [
    { 'time': '2019-10-25 12:05:00', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:01', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:02', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:03', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:04', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:05', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:06', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:07', 'name': 'lise' },
    { 'time': '2019-10-25 12:05:09', 'name': 'lise' },
  ];

  $timeMap = {};
  const startTime = $arr[0]['time'];
  $arr.forEach((item) => {
    const { time, name } = item;
    const $key = getTimeFloor(time, 3, startTime);
    // const $key = getTimeFloor(time, 3, '2019-10-25 12:04:04');
    if (!$timeMap[$key]) {
      $timeMap[$key] = [];
      array_push($timeMap[$key], item);
    } else {
      array_push($timeMap[$key], item);
    }
  })

  function array_push(arr, item) {
    arr.push(item);
  }
  console.log($timeMap);
}