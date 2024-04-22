interface Props<T> {
  compare: (a: T) => any;
  addedHandle?: (a: T) => void;
  reducedHandle?: (a: T) => void;
  data?: Array<T>;
}

export class ListChangeControler<T> {
  private itemList: T[]; // 上一次的列表

  private readonly compare: (a: T) => any;

  private readonly addedHandle?: (a: T) => void; // addedHandle
  private readonly reducedHandle?: (a: T) => void;

  constructor(props: Props<T>) {
    this.itemList = props.data || [];
    this.compare = props.compare;
    this.addedHandle = props.addedHandle;
    this.reducedHandle = props.reducedHandle;
  }

  private diffData(nextList: T[]) {
    return diffListBy<T>(this.itemList, nextList, this.compare);
  }

  setData(nextList: T[]) {
    const { added, removed } = this.diffData(nextList);
    this.reducedHandle && removed.forEach(this.reducedHandle);
    this.addedHandle && added.forEach(this.addedHandle);
    this.itemList = [].concat(nextList);
    return { added, removed };
  }

  // getData() {
  //   return this.itemList;
  // }
}

/**
 * 获取变化的数组
 */
function diffListBy<T>(prev: T[], next: T[], compare: (item: T) => any) {
  const prevMap = new Map(prev.map((item) => [compare(item), item]));
  const nextMap = new Map(next.map((item) => [compare(item), item]));

  const added: T[] = [];
  const removed: T[] = [];

  for (const [key, nextItem] of nextMap.entries()) {
    const prevItem = prevMap.get(key);
    if (prevItem) {
      prevMap.delete(key);
    } else {
      added.push(nextItem);
    }
  }

  for (const [_, prevItem] of prevMap.entries()) {
    removed.push(prevItem);
  }

  return { added, removed };
}
