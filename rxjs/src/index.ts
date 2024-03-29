import { of, from, fromEvent, Observable, Observer, interval, Subject, pipe, ReplaySubject, asyncScheduler } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators'

/* ======================================================================================================== */
/* ============== Observable 可观察对象 Observer 观察者 Subscription 订阅 基本概念与使用 ===================== */
/* ======================================================================================================== */


/* 一, ======  可以看作函数的泛化 | Observables 像是没有参数, 但可以泛化为多个值的函数。 | Generator  ====== */

// 1. 创建一个 Observable [数据源]:  把 1 2 转换成 Observable
const DemoObservable = of('1', '2')
// 2. 观察者: 一个回调函数集合, 根据相应的状态 来决定执行什么 方式, 做一些事
const watcher: Observer<string> = {
    next: val => console.log(val),
    error: err => console.log(err),
    complete: () => console.log('complete') // 很多的 Observer 是不会执行这项的, 如: 监听事件
}
// 3. 订阅: subscribe 是一个动作, 让 Observable 与 Observer 产生联系.
const ofSubscription = DemoObservable.subscribe(watcher) // subscribe 后,返回一个 Subscription, 用于取消订阅, 类似 setInterval 返回定时器的. 
// DemoObservable.subscribe(val=>console.log(val)) // 常用 简写形式 next 的执行
// later time
ofSubscription.unsubscribe();  // 这里有意义吗? 就 of 来说, 这里的 subscribe 作用就是 执行函数  call调用 的效果一样的. of 的观察者 仅会执行一次

/* 二, ====== 可以持续触发回调  | Observables 的行为可能会比较像 EventEmitters，但通常情况下 Observables 的行为并不像 EventEmitters 。 ====== */

const intervalObservable = interval(1000) // 1. 创建Observable[数据源]: 1000 毫秒 产生一个 递增的数字.
const intervalSubscription = intervalObservable.subscribe(val => console.log(val))
setTimeout(() => intervalSubscription.unsubscribe(), 3000) // 三秒后取消订阅

/* ======= 一些转换 Observable 的方法  ======== */
of('foo', 'bar'); // 来自一个或多个值
interval(1000); // 每秒 返回自 +1 的数
from([1, 2, 3]); // 转换自 数组
fromEvent(document.getElementById('btn'), 'click'); // 来自事件
/* ====== 创建 Observable 的方法 ====== */

// 在内部产生新事件
const b = Observable.create(function subscribe(observer: any) {
    observer.next(1);
    observer.next(2);
    observer.complete();
})
b.subscribe((val: any) => console.log(val))

// 在外部产生新事件. 后面会有详细的介绍, Subject 是一个特殊的 Observable
const c = new Subject<string>()
c.subscribe(val => {
    console.log(val);
})
c.next('a')

/* ============================================================================================================================ */
/* ========================================== Operators 操作符 pipe 管道 的基本概念与使用 ======================================= */
/* ============================================================================================================================ */


// rxjs入门6之合并数据流
// https://www.cnblogs.com/honkerzh/p/10863190.html

const old = interval(1000); // 返回一个 Observable
// old.subscribe(val => console.log(val))

/*  1. 返回一个新的 Observable , 不影响原 Observable . Operators 本质上是一个纯函数. 处理流 或 处理数据 */

// const changeInterval = map<number, string>(x => '#' + x)
// const new1 = changeInterval(old);
// new1.subscribe(val => console.log(val))

/* 2. pipe 作用是连接多个 Operators, 会进行链式调用 */

// const changeInterval2 = pipe(
//     filter<number>(value => value % 2 !== 0), // 处理流
//     map<number, string>(x => '##' + x) // 处理数据
// )
// const new2 = changeInterval2(old)
// new2.subscribe(val => console.log(val))

/* 3. 常用 简写形式 */

const csub = old.pipe(filter<number>(value => value % 2 !== 0), map<number, string>(x => '##' + x))
    .subscribe(val => console.log(val))

setTimeout(() => {
    csub.unsubscribe();
}, 5000);


/* ============================================================================================================================ */
/* =========================================== Subject 主题/主体 的基本概念与==================================================== */
/* ============================================================================================================================ */

/* 

Subject 是一个特殊的  Observable

可以理解成一个高级的 Observable 中转站

会维护一个 订阅列表, 可以派发新的数据. 也可以做数据的 中转

Subjects 是将任意 Observable 执行共享给多个观察者的唯一方式

在外部产生新事件的方式

Observable 的单播, Subject 多播 , 没理解, 效果上也没看出来. @@

*/
const aSubject = new Subject<any>()

// 新增了 两个订阅者
aSubject.subscribe(val => console.log(val))
aSubject.subscribe(val => console.log(val))

aSubject.next(1) // 派发数据

let DemoObservable2: Observable<any>;
DemoObservable2 = fromEvent(document.getElementById('btn'), 'click')

DemoObservable2.subscribe(val => {
    console.log('订阅1', val);
})

DemoObservable2.pipe(
    map(x => x.target)
).subscribe(aSubject) // 作为观察者, 转发数据/事件


/* === Subject 还有一些变体, 可以实现一些高级的效果 === */

// BehaviorSubject ReplaySubject AsyncSubject

const aReplaySubject = new ReplaySubject<any>(2) // 缓存2次 数据, 当有 新的订阅者的时候, 立即发送缓存的数据
// 能用在什么场景,没想到, 有点像这么一个场景: 群聊, 行加入成员的时候, 把最近几条消息推送给新成员

aReplaySubject.subscribe(val => console.log(val))
aReplaySubject.next('text1')
aReplaySubject.next('text2')
aReplaySubject.next('text3')
aReplaySubject.subscribe(val => console.log(val)) // 执行, 订阅者个动作的时候, 会立即输出 text2 text3

aReplaySubject.next('text4')


/* ============================================================================================================================ */
/* =========================================== Scheduler 调度器 的基本概念与使用 ================================================ */
/* ============================================================================================================================ */

/*  js event-loop 微任务 宏任务, 关于 执行顺序的调度 */

const aScheduler = of(1, 2, 3, asyncScheduler);
const bScheduler = of(1, 2, 3);

aScheduler.subscribe(val => console.log('aScheduler', val)) // 使用了 asyncScheduler , 将会 出现在 bScheduler 后面
bScheduler.subscribe(val => console.log('bScheduler', val))


/* ============================================================================================================================ */
/* =========================================== State Store 状态与储存 的基本概念与使用 ========================================== */
/* ============================================================================================================================ */

/* 
    rxjs 是无状态的, 但是应用是有状态的, 所以 rxjs 需要状态. 如: 点击 count
*/

const button = document.getElementById('btn2');
const btn2Event = fromEvent(button, 'click')
btn2Event.pipe(
    scan(count => count + 1, 0),
    map<number, string>(val => '' + val) // <number,string> 类型 , 输入 为 number 返回 string
).subscribe((count2) => {
    console.log(document.getElementById('count').innerHTML = count2)
});
