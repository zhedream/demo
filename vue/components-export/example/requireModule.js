function requireModuleList(modules) {
  return new Promise((res) => {
    window.require(modules, function (...args) {
      res(args);
    });
  });
}
function requireModule(module) {
  return new Promise((res) => {
    window.require([module], function (module) {
      res(module);
    });
  });
}

async function loadScript(url) {
  const script_text = await fetchText(url);
  const script_text_eval = `(async ()=>{ ${script_text} })() `;
  return await eval(script_text_eval);
}

function fetchText(url) {
  return fetch(url).then((res) => res.text());
}

// TODO: 加载自定义模块, 同时并行加载, 同时用到一个模块, 可能会重复请求记载, 存在锁问题, 使用 Promise 解决
var loadModule = (() => {
  const cache = {};

  async function loadModule(moduleUrl, isCache = true) {
    let moduleResolve, moduleReject;
    if (isCache && cache[moduleUrl]) {
      return cache[moduleUrl];
    } else {
      cache[moduleUrl] = new Promise((resolve, reject) => {
        moduleResolve = resolve;
        moduleReject = reject;
      });
    }

    const script_text = await fetchText(moduleUrl);
    const script_text_eval = `(async ()=>{ 
        try{
          ${script_text} 
        }catch(e){
          console.error('加载模块失败', moduleUrl,e)
          moduleReject()
        }
      })() `;

    // 不要 const module = await eval(script_text_eval);
    const module = await eval(script_text_eval);
    moduleResolve(module);
    return module;
  }

  return loadModule;
})();
