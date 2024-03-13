import Koa from 'koa';
import Router from 'koa-router';
import fs from 'fs';

const app = new Koa();
const router = new Router();

// 假设我们有一个简单的数据存储
let todos = [
  { id: 1, text: 'Learn Koa', done: false },
  { id: 2, text: 'Build something with Koa', done: false }
];
let nextId = 3;

// 中间件解析请求体
app.use(async (ctx, next) => {
  await next();
  if (ctx.request.body && typeof ctx.request.body === 'object') {
    ctx.body = ctx.request.body;
  }
});

// 获取所有待办事项
router.get('/todos', (ctx) => {
  ctx.body = todos;
});

// 获取特定id的待办事项
router.get('/todos/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    ctx.body = todo;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Todo not found' };
  }
});

// 创建新的待办事项
router.post('/todos', (ctx) => {
  const { text } = ctx.request.body;
  if (!text) {
    ctx.status = 400;
    ctx.body = { error: 'Text is required' };
    return;
  }
  const newTodo = { id: nextId++, text, done: false };
  todos.push(newTodo);
  ctx.status = 201; // Created
  ctx.body = newTodo;
});

// 更新待办事项状态
router.put('/todos/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const { text, done } = ctx.request.body;
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = { id, text, done };
    ctx.body = todos[todoIndex];
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Todo not found' };
  }
});

// 删除待办事项
router.delete('/todos/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    ctx.status = 204; // No Content
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Todo not found' };
  }
});

router.get('/getImage', (ctx) => {
    // 允许跨域
    ctx.set("Access-Control-Allow-Origin", "*");

    // 图片地址 "../html/blob/Normal.png"
    // stream 流的方式读取图片


})

// 使用路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
