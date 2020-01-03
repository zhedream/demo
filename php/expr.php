<?php
/* 一些表达式的使用 */
/* 

$res = ( (表达式1) ? (表达式2) : (表达式3) )

将三目运算, 看成一个整体

由三个部分组成, 表达式1:  表达式2:  表达式3: 

三目运算中的的表达式, 可以是
 [一个值]
 [简单的运算]
 [一个函数返回值]. 没有返回值则为 null
 [另一个三目运算]. (不推荐嵌套使用)

 1. 表达式1 的值会转成 bool 值
 2. 为 true 时, 执行表达式2 ,表达式2的值 将会作为, 这个三目运算整体的值
 3. 为 false 时, 执行表达式3 ,表达式3的值 将会作为, 这个三目运算整体的值

*/

/* 用法 */

$res = ( (1+1==3) ? ('正确') : ('错误') );
$res = 1+1==3 ? '正确' : '错误'; // 可以省略 ()
echo $res; // 错误

echo $res = 1 + 1 ; // 2 , $res = 1 + 1 看成个整体 ($res = 1 + 1),  $res 赋值后, 作这个表达式的整体的值
$r = 1+1==3 ? $res='正确' : $res='错误'; // 可以省略 ()
echo $r , $res; // 错误 错误


$res = isset($_GET['name']) ? $_GET['name'] : '匿名';

/* 拓展1 */

// ?? 运算符 NULL 合并运算符
// ?: 三目运算符的 简写

$a = 10;
var_dump($a ?? "a"); // 相当于: isset($a) ? $a : 'a' => 输出 10  
var_dump($a ?: "b"); // 相当于: $a ? $a : 'a' =>输出 10

$a = false;
var_dump($a ?? "a"); // 相当于: isset($a) ? $a : 'a' => 输出 false
var_dump($a ?: "b"); // 相当于: $a ? $a : 'a' =>输出 10

$res = $_GET['name'] ?? $_GET['name2'] ?? '匿名'; // 可以连着写 , 满足一个 非null 就返回, 没有满足的返回 null.

/* 拓展2: 立即执行函数 */
$expr = true;
$res = (function()use($expr){
    if($expr){
       return  '1' ;// code
    }else{
       return  '2' ; // code
    }
})(); // $res = 1

/* 拓展3 */

$path = '';
is_dir($path) || mkdir($path,0777,true); // 1. 不满足条件, 才做什么

$condition = false;
$condition && run(); // 2. 满足条件, 才做什么

$condition = true; // 定义循环外
$condition && run(); // 执行一次, 改造一下 放在循环里, 只会执行一次 run
$condition && $condition = false;

$condition = false; // 定义循环外 , 或 静态变量
$condition || run(); // 执行一次, 改造一下 放在循环里, 只会执行一次 run
$condition || $condition = true;

$condition = 0;
$condition++ || run(); // 执行一次

$condition = 0;
(9 == $condition++) || run(); // 第 10 次循环 , 执行

$condition = 0;
(9 == $condition++) || run(); // 第 10 次循环 , 执行
