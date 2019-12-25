import { List, Map, fromJS, } from 'immutable'

let lst = fromJS([1, 2, ['2'], 4, 5]) as List<number>; // 默认转换成 List

// console.log(lst.get(2)); // 3

// lst.forEach((element: any) => {
//     console.log(element); // 1, 2, 3, 4, 5
// });
lst = lst.set(3, 9); // 必须重新 赋值

lst.forEach((val: number, key) => {
    lst = lst.set(key, val + 1); // 每次都赋值, 影响性能吗?
    // console.log(element); // 1, 2, 3, 9, 5
});
lst.forEach((val: number) => {
    console.log(val); // 1, 2, 3, 9, 5
});

lst.setIn(['a','2'],3)

let lstArr = lst.toJS() as Array<any>;

lstArr.forEach(element => {

});



let $$data = Map({ hello: "immutable" });
function changeData($$data: Map<string, string>) {
    $$data = $$data.set("hello", "world")
}
changeData($$data)
console.log($$data.toJS())



// for (const key in lst.keys()) {

//     console.log(lst.get(key));
// }
