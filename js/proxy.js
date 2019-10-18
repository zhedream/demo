class Big {
    str = ''
    constructor(str) {
        this.str = str
    }
}


let a = new Big(11);

// console.log(a);



let xiaohong = {
    name: "小红",
    age: 15
  };
  xiaohong = new Proxy(xiaohong, {
    get(target, key) {
      let result = target[key];
      //如果是获取 money 属性，则添加 元字
      if (key === "age") result += "岁";
      return result;
    },
    set(target, key, value) {
      if (key === "age" && typeof value !== "number") {
        throw Error("age字段必须为Number类型");
      }
      target[key] = value;
      // return Reflect.set(target, key, value);
    }
  });

  let age = xiaohong.age;
  console.log(age);
  
//   console.log(xiaohong.age);
  
