// 引用计数包装器
class ReferenceCountWrapper {
  constructor(item) {
    this.preLinkCount = 0;
    this.value = item;
    this.links = new Set();
    Object.seal(this);
  }

  /**
   * 添加关系 link
   * @param link
   * @returns {boolean} 是否添加成功
   */
  addLink(link) {
    this.links.add(link);
    return this.linkSize > this.preLinkCount++;
  }

  /**
   * 删除关系 link
   * @param link
   * @returns {boolean}
   */
  deleteLink(link) {
    this.links.delete(link);
    return this.linkSize < this.preLinkCount--;
  }

  get linkSize() {
    return this.links.size;
  }
}

class ReferenceUpdater {
  /**
   *
   * @param options
   * @param options.updateHandler 更新回调
   */
  constructor(options = {}) {
    /**
     * 维护的 items
     * @type {Set<ReferenceCountWrapper>}
     */
    this.items = new Set();
    /**
     * 上次更新的 items
     * @type {ReferenceCountWrapper[]}
     */
    this.lastUpdateItems = []; // 上次 update 的 items
    this.updateHandler = options.updateHandler;
    this.itemHandler = options.itemHandler;
    this.linkHandler = options.linkHandler;
  }

  /**
   * 添加 item
   * @param {ReferenceCountWrapper} item
   */
  addItem(item) {
    this.items.add(item);
  }

  /**
   * @param {ReferenceCountWrapper} item
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * 派发更新
   */
  updateItem() {
    let next = [];
    // 引用计数为大于0的 item
    this.items.forEach((item) => {
      if (item.linkSize > 0) {
        next.push(item);
      }
    });
    let { sub, add } = ReferenceUpdater.diffArr(this.lastUpdateItems, next);
    let current = ReferenceUpdater.intersection(this.lastUpdateItems, next);
    this.updateHandler && this.updateHandler({ add, sub, current });
    this.lastUpdateItems = next;
  }

  static diffArr(pre, next) {
    let add = [],
      sub = [];
    let difference = next
      .concat(pre)
      .filter((v) => !next.includes(v) || !pre.includes(v)); // 对称差集
    sub = difference.filter((v) => pre.includes(v)); // difference - a  相对补集
    add = difference.filter((v) => !pre.includes(v)); // difference - (difference - a) 的 相对补集
    // console.log("对称差集", difference);
    // console.log("新增", add);
    // console.log("减少", sub);
    return { add, sub };
  }

  // 交集2 A 有 且 B 有
  static intersection(a, b) {
    let mapCount = new Map();
    new Set(a).forEach((v) => {
      if (mapCount.has(v)) mapCount.set(v, mapCount.get(v) + 1);
      else mapCount.set(v, 1);
    });
    new Set(b).forEach((v) => {
      if (mapCount.has(v)) mapCount.set(v, mapCount.get(v) + 1);
      else mapCount.set(v, 1);
    });
    let res = [];
    mapCount.forEach((count, v) => count > 1 && res.push(v));
    return res;
  }
}

/**
 * 任务线更新器
 */
class TaskLineUpdate extends ReferenceUpdater {
  constructor(options = {}) {
    super(options);
    /**
     * @type {Map<string, ReferenceCountWrapper>}
     */
    this.lineMap = new Map();
  }

  /**
   * 添加需要维护的线,  添加线和任务的关联
   * @param {string} lineID 线ID
   * @param {string | string[]} taskIDs 任务ID
   * @param {*} lineData 线数据
   */
  addLine(lineID, taskIDs, lineData) {
    /**
     * @type {ReferenceCountWrapper | never}
     */
    let line = this.lineMap.get(lineID);
    if (!line) {
      line = new ReferenceCountWrapper(lineData);
      this.lineMap.set(lineID, line);
      // 添加到维护列表 items 中
      this.addItem(line);
    }

    // 添加 线和任务的关联
    if (typeof taskIDs === "string") taskIDs = [taskIDs];
    taskIDs.forEach((taskID) => {
      line.addLink(taskID);
    });
  }

  deleteLine(lineID) {
    let line = this.lineMap.get(lineID);
    if (line) {
      this.items.delete(line);
      this.lineMap.delete(lineID);
    }
  }

  /**
   *
   * @param {string} lineID
   * @param {string} taskID
   */
  deleteLink(lineID, taskID) {
    /**
     * @type {ReferenceCountWrapper | undefined}
     */
    let line = this.lineMap.get(lineID);
    if (line) {
      line.deleteLink(taskID);
    }
  }

  updateLine() {
    this.updateItem();
  }
}

let linesUpdater = new TaskLineUpdate({
  // itemHandler: (item) => {}, // ReferenceCountWrapper
  // linkHandler: (item, link) => {},
  updateHandler: ({ add, sub, current }) => {
    add.forEach((item) => {
      console.log("add", item);
    });
    sub.forEach((item) => {
      console.log("sub", item);
    });
    console.log("current: ", current);
  },
});

linesUpdater.addLine("lineA", "1", { name: "lineA" });
linesUpdater.addLine("lineA", "2", { name: "lineA" });

linesUpdater.updateLine();

linesUpdater.deleteLink("lineA", "1");

linesUpdater.updateLine();

linesUpdater.deleteLink("lineA", "1");
linesUpdater.deleteLink("lineA", "2");

linesUpdater.updateLine();
linesUpdater.updateLine();

// let linesUpdater = new ReferenceUpdater({
//   // itemHandler: (item) => {}, // ReferenceCountWrapper
//   // linkHandler: (item, link) => {},
//   updateHandler: ({ add, sub }) => {
//     add.forEach((item) => {
//       console.log("add", item.value);
//     });
//     sub.forEach((item) => {
//       console.log("sub", item.value);
//     });
//   },
// });

// let line = {};
// let lineR = new ReferenceCountWrapper(line);
// lineR.addLink("A");

// linesUpdater.addLine(lineR, "lineA");

// linesUpdater.update();
