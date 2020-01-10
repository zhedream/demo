function MyNumberType(n) {
    this.string = String('this a string');
    this.number2 = n + 2;
}
MyNumberType.prototype.valueOf = function () {
    return this.number + '3';
};
MyNumberType.prototype.toString = function dogToString() {
    return this.string + 'toString';
}



var myObj = new MyNumberType(4);

console.log(String(myObj));
console.log(Number(myObj));
console.log(myObj++);
console.log(myObj++);
