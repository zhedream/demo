// 引用计数包装器

class ReferenceCountWrapper<V, L> {
  value: V;
  private _preLinkCount: number;
  private links: Set<L>;

  constructor(item: V) {
    this._preLinkCount = 0;
    this.value = item;
    this.links = new Set();
    Object.seal(this);
  }

  get linkSize() {
    return this.links.size;
  }

  // 添加关系 link
  addLink(link: L) {
    this.links.add(link);
    const flag = this.linkSize > this._preLinkCount;
    this._preLinkCount = this.linkSize;
    return flag;
  }

  // 删除关系 link
  deleteLink(link: L) {
    this.links.delete(link);
    const flag = this.linkSize < this._preLinkCount;
    this._preLinkCount = this.linkSize;
    return flag;
  }
}

interface Options<V, L> {
  addedHandle?: (a: ReferenceCountWrapper<V, L>) => void;
  reducedHandle?: (a: ReferenceCountWrapper<V, L>) => void;
}

class ReferenceUpdater<
  V,
  L,
  T extends ReferenceCountWrapper<V, L> = ReferenceCountWrapper<V, L>
> {
  private items: Set<T>;
  private lastUpdateItems: T[];

  private readonly addedHandle?: (a: T) => void; // addedHandle
  private readonly reducedHandle?: (a: T) => void;

  constructor(options: Options<V, L>) {
    this.items = new Set();
    this.lastUpdateItems = [];
    this.addedHandle = options.addedHandle;
    this.reducedHandle = options.reducedHandle;
  }

  addItem(item: T) {
    this.items.add(item);
  }

  deleteItem(item: T) {
    this.items.delete(item);
  }

  // 派发更新
  updateItem() {
    let next: T[] = [];
    // 引用计数为大于0的 item
    this.items.forEach((item) => {
      if (item.linkSize > 0) {
        next.push(item);
      }
    });
    let { added, removed } = diffList(this.lastUpdateItems, next);
    this.addedHandle && added.forEach(this.addedHandle);
    this.reducedHandle && removed.forEach(this.reducedHandle);
    this.lastUpdateItems = next;
  }
}

/**
 * 任务线更新器, 多任务对应一条线
 * @description 背景: 多个任务,对应一个方案路线时,需要维护任务和方案的引用关系
 * @description 任务和方案的关系是多对一的关系
 * @description 保证对任务对应同一个方案路线,不会重复添加
 */
export class TaskLineUpdater<T> extends ReferenceUpdater<T, string> {
  private lineMap: Map<string, ReferenceCountWrapper<T, string>>;

  constructor(options: Options<T, string>) {
    super(options);
    this.lineMap = new Map();
  }

  /**
   * 添加需要维护的线,  添加线和任务的关联, 不会重复添加
   * @param lineID 线ID
   * @param linkIDs 任务ID
   * @param lineData 线数据
   */
  addLine(lineID: string, linkIDs: string | string[], lineData: T) {
    let line = this.lineMap.get(lineID);
    if (!line) {
      line = new ReferenceCountWrapper(lineData);
      this.lineMap.set(lineID, line);
      // 添加到维护列表 items 中
      this.addItem(line);
    }
    // 添加 线和任务的关联
    if (typeof linkIDs === "string") {
      linkIDs = [linkIDs];
    }
    linkIDs.forEach((taskID) => {
      line.addLink(taskID);
    });
  }

  /**
   * 移除线和任务的关联, 无关联时删除线
   * @param lineID 线ID
   * @param linkIDs 任务ID
   */
  removeLine(lineID: string, linkIDs: string | string[]) {
    let line = this.lineMap.get(lineID);
    if (line) {
      if (typeof linkIDs === "string") linkIDs = [linkIDs];
      linkIDs.forEach((taskID) => {
        this.deleteLineLink(lineID, taskID);
      });

      if (line.linkSize === 0) {
        this.deleteLine(lineID);
      }
    }
  }

  /**
   * 删除线和任务的关联
   * @param lineID 线ID
   * @param linkID 任务ID
   */
  private deleteLineLink(lineID: string, linkID: string) {
    let line = this.lineMap.get(lineID);
    if (line) {
      line.deleteLink(linkID);
    }
  }

  /**
   * 删除线
   * @param lineID 线ID
   */
  private deleteLine(lineID: string) {
    let line = this.lineMap.get(lineID);
    if (line) {
      this.deleteItem(line);
      this.lineMap.delete(lineID);
    }
  }

  // clear() {
  //   this.lineMap.forEach((line) => {
  //     this.deleteItem(line);
  //   });
  //   this.lineMap.clear();
  // }

  updateLine() {
    this.updateItem();
  }
}

function diffList<T>(pre: T[], next: T[]) {
  const set1 = new Set(pre);
  const set2 = new Set(next);

  const added: T[] = [];
  const removed: T[] = [];

  for (const item of set1) {
    if (!set2.has(item)) {
      removed.push(item);
    }
  }

  for (const item of set2) {
    if (!set1.has(item)) {
      added.push(item);
    }
  }

  return { added, removed };
}
