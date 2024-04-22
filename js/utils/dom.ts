/**
 * 复制内容
 * @param {string} content
 * @returns {Boolean}
 */
function copy(content) {
  // input 不能换行
  // textarea 支持 \n 换行复制
  // 复制 dom.innerText
  let temp = document.createElement("textarea");
  temp.value = content;
  document.body.appendChild(temp);
  temp.select();
  let flag = document.execCommand("Copy");
  temp.remove();
  return flag;
}

function getDom(selector) {
  if (selector instanceof HTMLElement) return selector;
  return document.querySelector(selector);
}

/**
 * 获取元素的 top 值
 * @param element
 * @param pageTop （是否相对于窗口）
 * @returns {number}
 */
export function getElementTop(element: HTMLElement, pageTop = false): number {
  let actualTop = element.offsetTop;
  let current = element.offsetParent as HTMLElement;

  let scrollTop = 0;
  let topElement = element;
  while (pageTop && topElement !== null) {
    scrollTop += topElement.scrollTop ? topElement.scrollTop : 0;
    topElement = topElement.parentElement;
  }

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return actualTop - scrollTop;
}

/**
 * 获取元素的 left 值
 * @param element
 * @param pageLeft （是否相对于窗口）
 * @returns {number}
 */
export function getElementLeft(element: HTMLElement, pageLeft = false): number {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent as HTMLElement;

  let scrollLeft = 0;
  let leftElement = element;
  while (pageLeft && leftElement !== null) {
    scrollLeft += leftElement.scrollLeft ? leftElement.scrollLeft : 0;
    leftElement = leftElement.parentNode as HTMLElement;
  }

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent as HTMLElement;
  }
  return actualLeft - scrollLeft;
}

/**
 * 下载文件
 * @param {*} url
 */
function downLoadUrl(url) {
  let link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  let event = new MouseEvent("click");
  link.dispatchEvent(event);
  link.remove();
  link = null;
}

/**
 * @param {string} src
 */
function getImage(src) {
  let image = new Image();
  return new Promise((res) => {
    image.onload = function () {
      image.onload = null;
      return res(image);
    };
    image.src = src;
  });
}

function domResize(selector, callback, timeout = 100) {
  const that = callback;
  let container;
  if (selector instanceof HTMLElement) container = selector;
  else container = document.querySelector(selector);

  // 监测 宽度变化
  const lastWidth_symbol = Symbol("lastWidth");
  const lastHeight_symbol = Symbol("lastHeight");
  const time_symbol = Symbol("time");
  if (window.ResizeObserver) {
    const ob_symbol = Symbol("ob");

    const Observer = (entries) => {
      if (that[time_symbol]) {
        clearTimeout(that[time_symbol]);
        that[time_symbol] = null;
      }
      that[time_symbol] = setTimeout(() => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          // console.log("Element:", entry.target);
          // console.log(`Element size: ${cr.width}px x ${cr.height}px`);
          // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);

          if (cr.width > 0 && cr.width !== that[lastWidth_symbol]) {
            that[lastWidth_symbol] = cr.width;
            callback();
            return;
          }
          if (cr.height > 0 && cr.height !== that[lastHeight_symbol]) {
            that[lastHeight_symbol] = cr.height;
            callback();
            return;
          }
        }
      }, timeout);
    };
    that[ob_symbol] = new ResizeObserver((entries) => Observer(entries));
    that[ob_symbol].observe(container);
    return () => that[ob_symbol].disconnect();
  } else {
    const onresize = () => {
      if (that[time_symbol]) {
        clearTimeout(that[time_symbol]);
        that[time_symbol] = null;
      }
      that[time_symbol] = setTimeout(() => callback(), timeout);
    };
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }
}
