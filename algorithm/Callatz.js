/* 
卡拉兹(Callatz)猜想：

对任何一个正整数 n，如果它是偶数，那么把它砍掉一半；
如果它是奇数，那么把 (3n+1) 砍掉一半。
这样一直反复砍下去，最后一定在某一步得到 n=1。
*/

function go(n, m) {
  if (n == 1) return m;
  if (n % 2 == 0) return go(n / 2, m + 1);
  else return go((3 * n + 1) / 2, m + 1);
}

console.log(go(3, 0));

var a = "1234567890987654321123456789";

let map = {
  1: "yi",
  2: "er",
  3: "san",
  4: "si",
  5: "wu",
  6: "liu",
  7: "qi",
  8: "ba",
  9: "jiu",
  0: "ling",
};

console.log(
  a
    .split("")
    .reduce((sum, v) => +v + sum, 0)
    .toString()
    .split('')
    .map((v) => map[v])
    .join(' ')
);
