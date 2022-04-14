var list = [
  { name: '上海', code: 'shanghai', },
  { name: '西安', code: 'xian' },
  { name: '深圳', code: 'shenzhen' },
  { name: '北京', code: 'beijing' }
];

let order = ['beijing', 'xian', 'shanghai', 'shenzhen'];

// 根据order的顺序，把list中的数据按照order的顺序排列
function sort1(list, order) {
  list.sort((a, b) => {
    return order.indexOf(a.code) - order.indexOf(b.code);
  });
}

let order2 = [
  { name: '上海', code: 'shanghai', index: 0 },
  { name: '西安', code: 'xian', index: 1 },
  { name: '深圳', code: 'shenzhen', index: 4 },
  { name: '北京', code: 'beijing', index: 3 }
];

// order2 转对象 code 到 index
let order3 = order2.reduce((acc, cur) => {
  acc[cur.code] = cur.index;
  return acc;
}, {});

console.log('order3: ', order3);

// 根据order3的顺序，把list中的数据按照order3的顺序排列
function sort2(list, order3) {
  list.sort((a, b) => {
    return order3[a.code] - order3[b.code];
  });
}

sort2(list, order3);

console.log('list: ', list);
