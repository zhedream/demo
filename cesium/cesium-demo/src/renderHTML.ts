import Vue from "vue";

export function renderHTML(vueOption: any, propsData: any = {}) {
  const V = Vue.extend(vueOption);

  let dom: HTMLDivElement = document.createElement("div");
  dom.innerHTML = '111'
  let dom2: HTMLDivElement = document.createElement("div");
  dom2.innerHTML = '222'
  let dom3: HTMLDivElement = document.createElement("div");
  dom3.innerHTML = '333'
  document.body.appendChild(dom);
  document.body.appendChild(dom2);
  document.body.appendChild(dom3);
  return new Promise<[HTMLDivElement, Element, Vue]>((res) => {
    new V({
      propsData: {
        msg: "hello",
      },
      data: {
        cc: "cc2",
      },
      mounted() {
        setTimeout(() => {
          res([dom, this.$el, this]);
        }, 2000);
        // this.$destroy();
      },
      beforeDestroy() {
        if (dom) {
          dom.remove();
          dom = null as any;
        }
      },
    }).$mount(dom2);
  });
}
