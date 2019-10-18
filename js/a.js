function Test() {
    this._num = 0;
}
Test.prototype.setNumber = function (num) {
    this._num = num;
}
Test.prototype.toString = function () {
    return "change to String";
}
Test.prototype.valueOf = function () {
    return this._num;
}
var a = new Test();
a.setNumber(2);
var b = new Test();
b.setNumber(3);
if (a + b == 5) console.log("it works!");
console.log(a * b);
console.log(a / b);
console.log(a);
console.log(b);


/* 

参考:
https://www.cnblogs.com/wangkangluo1/archive/2013/03/18/2965476.html

*/