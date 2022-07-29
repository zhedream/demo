/*
   <div id="el">
      <div
        @mousedown="mousedownDrag($event, $el, 'body')"
        dragsign
      ></div>
    </div>

*/

export default {
  methods: {
    /**
     * 点击拖动
     * @description
     * @param {Event} e1 事件
     * @param {*} t 目标元素 拖动主体
     * @param {*} p 相对盒子
     * @param {*} option
     * @returns
     */
    mousedownDrag(e1, t, p, option = {}) {
      return mousedownDrag(e1, t || this.$el, p, option);
    },
  },
};

/**
 * @description 点击拖动
 * @param e1 事件
 * @param t 目标元素 拖动主体
 * @param p 相对盒子
 * @param option 选项 adsorb=5 needDragSign=true
 * @returns
 */
export function mousedownDrag(e1, t, p, option = {}) {
  // e1.stopPropagation();
  // e1.preventDefault();
  if (p === undefined) return;
  else if (typeof p == "string") {
    const tem = document.querySelector(p);
    if (tem) p = tem;
    else return;
  }

  if (t === undefined) return;
  else if (typeof t == "string") {
    const tem = document.querySelector(t);
    if (tem) t = tem;
    else return;
  }

  let ev = e1 || event;
  let dragsign = ev.target;
  // console.log("dragsign: ", dragsign);
  // console.log(e1);
  const target = t; // 拖动主体
  // console.log('target: ', target);
  const positionBox = p || document.body; // 相对盒子

  // const getDragSign = target => {};
  const needDragSign =
    option.needDragSign === undefined ? true : option.needDragSign;
  if (needDragSign) {
    let isDragSign = Array.from(dragsign.attributes).findIndex(
      (e) => e.name === "dragsign"
    );
    if (isDragSign === -1) return;
  }

  ev.stopPropagation();

  // 计算 相对窗口的实际位置
  const top = positionBox.offsetTop;
  const left = positionBox.offsetLeft;
  // const width = positionBox.clientWidth;
  // const height = positionBox.clientHeight;

  // const top = 0
  // const left = 0
  // const width = 0
  // const height = 0

  const adsorb = option.adsorb || 5; // 吸附距离

  const ptop = -top + 64; // tartet position 相对的父盒子 距顶部 偏移
  const pleft = -left; // 距左侧 偏移

  const pbottom = top; // 距底部 偏移
  const pright = left; // 距右侧 偏移

  let disX = ev.clientX - target.offsetLeft;
  let disY = ev.clientY - target.offsetTop;

  if (target.setCapture) {
    target.setCapture();
  }

  document.onmousemove = function(e2) {
    let ev = e2 || event;
    let L = ev.clientX - disX; //拖动元素左侧的位置=当前鼠标距离浏览器左侧的距离 - （物体宽度的一半）
    let T = ev.clientY - disY; //拖动元素顶部的位置=当前鼠标距离浏览器顶部的距离 - （物体高度的一半）

    // console.log(T);
    // console.log(L);

    if (L < pleft + adsorb) {
      //如果左侧的距离小于0，就让距离等于0.不能超出屏幕左侧。如果需要磁性吸附，把0改为100或者想要的数字即可
      L = pleft;
    } else if (
      L >
      document.documentElement.clientWidth -
        target.offsetWidth -
        pright -
        adsorb
    ) {
      //如果左侧的距离>屏幕的宽度-元素的宽度。也就是说元素的右侧超出屏幕的右侧，就让元素的右侧在屏幕的右侧上
      L = document.documentElement.clientWidth - target.offsetWidth - pright;
    }

    if (T < ptop + adsorb) {
      // 和左右距离同理
      T = ptop;
    } else if (
      T >
      document.documentElement.clientHeight -
        target.offsetHeight -
        pbottom -
        adsorb
    ) {
      T = document.documentElement.clientHeight - target.offsetHeight - pbottom;
    }

    target.style.left = L + "px";
    target.style.top = T + "px";
  };

  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null;
    if (target.releaseCapture) {
      target.releaseCapture();
    }
  };

  return false;
}
