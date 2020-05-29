# D3 学习

1. yarn add webpack webpack-cli -D // webpack 核心库 和  webpack 脚手架

2. yarn add webpack-dev-server html-webpack-plugin -D // 调式server 和 处理 html

3. yarn add typescript ts-loader -D // typescript 核心库 和 ts-loadder 用于处理打包

4. npx tsc  --init // 用的就那几个选项

5. yarn add D3

6. yarn add @types/d3 -D


d3.extent(item,fn); 返回最小最大值  [min,max]

## d3-scale

**scaleLinear**

线性比例尺  y=fn(x)  
domain:域 输入的值作用域
range:范围
domain([0,10]) => range([0,100])
fn = scaleLinear().domain([0, 10]).range([0, 100])
fn(5) => 50

**scaleSequential**

domain([100,200]) => [0,1] 包装传入一个参数 并返回 一个函数
d3.scaleSequential((e)=>{console.log(e)}).domain([100,200])(150)
d3.scaleSequential().domain([0, 100]).interpolator((e)=>console.log(e))(50);

扩展: 有没有类似 相反的 API  [0,1] => range([0,100])

**颜色集合**

https://github.com/d3/d3-scale-chromatic