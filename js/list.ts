/**
 * 差集 , A 有 B 没有
 * @param  list1
 * @param  list2
 * @returns T[]
 */
export function difference<T>(list1: T[], list2: T[]) {
  const set2 = new Set(list2);
  const result: T[] = [];

  for (const item of list1) {
    if (!set2.has(item)) {
      result.push(item);
    }
  }
  return result;
}

/**
 * 对称差集 , A,B 交集外的元素
 * @param  arr1
 * @param  arr2
 * @returns T[]
 */
export function symmetricDifference<T>(arr1: T[], arr2: T[]): T[] {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result: T[] = [];

  for (const item of set1) {
    if (!set2.has(item)) {
      result.push(item);
    }
  }

  for (const item of set2) {
    if (!set1.has(item)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * 交集 A 有 且 B 有
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function intersect<T>(a: T[], b: T[]): T[] {
  const set1 = new Set(a);
  const set2 = new Set(b);
  const result: T[] = [];

  for (const item of set1) {
    if (set2.has(item)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * 获取变化的数组
 * @param {T[]} pre 上一个的数组
 * @param {T[]} next 下一个的数组
 * @returns 增加的元素 added , 减少的元素 removed
 */
export function diffList<T>(pre: T[], next: T[]) {
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

/**
 * 获取变化的数组
 */
export function diffListBy<T>(prev: T[], next: T[], compare: (item: T) => any) {
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
