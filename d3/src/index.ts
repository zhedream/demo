import * as d3 from 'd3'

var width = 300; //画布的宽度
var height = 300; //画布的高度


const svg = d3.create("svg")
  .attr('width', width) //设定宽度
  .attr('height', height) //设定高度
  .attr('style', 'background-color:#eee;'); //设置svg画布的背景色为灰色

// const svg = d3.select('body') //选择文档中的body元素
//   .append('svg') //添加一个svg元素
//   .attr('width', width) //设定宽度
//   .attr('height', height) //设定高度
//   .attr('style', 'background-color:#eee;'); //设置svg画布的背景色为灰色

var dataset = [10, 210, 170, 130, 55]; //数据（表示矩形的宽度）

const linear = d3.scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, 300])

var rectHeight = 25; //每个矩形所占的像素高度（包括空白）

svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', 20)
  .attr('y', function (d, i) {
    return i * rectHeight + 20;
  })
  .attr('width', function (d, i) {
    return linear(d);
  })
  .attr('height', function (d, i) {
    return rectHeight - 2;
  })
  .attr('fill', 'steelblue');

let axis = d3.axisBottom(linear).ticks(5)

svg.append('g').call(axis)

document.body.append(svg.node())

