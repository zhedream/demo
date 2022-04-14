// 实现 数据结构 大根堆
class Heap {
  constructor(compareFn) {
    this.compareFn = compareFn;
    this.data = [];
  }
  // 向大根堆中添加一个元素
  add(item) {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }
  // 删除大根堆中的最大元素
  remove() {
    if (this.data.length === 0) {
      return null;
    }
    if (this.data.length === 1) {
      return this.data.pop();
    }
    const last = this.data.pop();
    const first = this.data[0];
    this.data[0] = last;
    this.siftDown(0);
    return first;
  }
  // 向上调整
  siftUp(index) {
    const parent = this.parent(index);
    if (parent < 0) {
      return;
    }
    if (this.compareFn(this.data[parent], this.data[index]) < 0) {
      const temp = this.data[parent];
      this.data[parent] = this.data[index];
      this.data[index] = temp;
      this.siftUp(parent);
    }
  }
  // 向下调整
  siftDown(index) {
    const left = this.left(index);
    const right = this.right(index);
    let max = index;
    if (left < this.data.length && this.compareFn(this.data[left], this.data[max]) > 0) {
      max = left;
    }
    if (right < this.data.length && this.compareFn(this.data[right], this.data[max]) > 0) {
      max = right;
    }
    if (max !== index) {
      const temp = this.data[max];
      this.data[max] = this.data[index];
      this.data[index] = temp;
      this.siftDown(max);
    }
  }
  // 获取父节点
  parent(index) {
    return Math.floor((index - 1) / 2);
  }
  // 获取左节点
  left(index) {
    return index * 2 + 1;
  }
  // 获取右节点
  right(index) {
    return index * 2 + 2;
  }
  // 获取大根堆中的元素个数
  get size() {
    return this.data.length;
  }
  // 获取大根堆中的最大元素
  get top() {
    return this.data[0];
  }
}
// 实现 数据结构 平衡二叉树
class AVLTree {
  constructor(compareFn) {
    this.compareFn = compareFn;
    this.root = null;
  }
  // 向平衡二叉树中添加一个元素
  add(item) {
    this.root = this.addNode(this.root, item);
  }
  // 向平衡二叉树中添加一个节点
  addNode(node, item) {
    if (node === null) {
      return new Node(item);
    }
    if (this.compareFn(item, node.item) < 0) {
      node.left = this.addNode(node.left, item);
    } else {
      node.right = this.addNode(node.right, item);
    }
    node.height = this.getHeight(node);
    return this.balance(node);
  }
  // 获取节点的高度
  getHeight(node) {
    if (node === null) {
      return 0;
    }
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }
  // 平衡二叉树
  balance(node) {
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor > 1) {
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left);
      }
      return this.rotateRight(node);
    }
    if (balanceFactor < -1) {
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right);
      }
      return this.rotateLeft(node);
    }
    return node;
  }
  // 获取节点的平衡因子
  getBalanceFactor(node) {
    if (node === null) {
      return 0;
    }
    return this.getHeight(node.left) - this.getHeight(node.right);
  }
  // 向左旋转
  rotateLeft(node) {
    const right = node.right;
    node.right = right.left;
    right.left = node;
    node.height = this.getHeight(node);
    right.height = this.getHeight(right);
    return right;
  }
  // 向右旋转
  rotateRight(node) {
    const left = node.left;
    node.left = left.right;
    left.right = node;
    node.height = this.getHeight(node);
    left.height = this.getHeight(left);
    return left;
  }
}

// 实现 数据结构 平衡二叉搜索树

class BST {
  constructor(compareFn) {
    this.compareFn = compareFn;
    this.root = null;
  }
  // 向平衡二叉搜索树中添加一个元素
  add(item) {
    this.root = this.addNode(this.root, item);
  }
  // 向平衡二叉搜索树中添加一个节点
  addNode(node, item) {
    if (node === null) {
      return new Node(item);
    }
    if (this.compareFn(item, node.item) < 0) {
      node.left = this.addNode(node.left, item);
    } else {
      node.right = this.addNode(node.right, item);
    }
    return node;
  }
  // 向平衡二叉搜索树中查找一个元素
  find(item) {
    return this.findNode(this.root, item);
  }
  // 向平衡二叉搜索树中查找一个节点
  findNode(node, item) {
    if (node === null) {
      return null;
    }
    if (this.compareFn(item, node.item) === 0) {
      return node;
    } else if (this.compareFn(item, node.item) < 0) {
      return this.findNode(node.left, item);
    } else {
      return this.findNode(node.right, item);
    }
  }
  // 向平衡二叉搜索树中删除一个元素
  remove(item) {
    this.root = this.removeNode(this.root, item);
  }
  // 向平衡二叉搜索树中删除一个节点
  removeNode(node, item) {
    if (node === null) {
      return null;
    }
    if (this.compareFn(item, node.item) < 0) {
      node.left = this.removeNode(node.left, item);
    } else if (this.compareFn(item, node.item) > 0) {
      node.right = this.removeNode(node.right, item);
    } else {
      if (node.left === null && node.right === null) {
        node = null;
      } else if (node.left === null) {
        node = node.right;
      } else if (node.right === null) {
        node = node.left;
      } else {
        const aux = this.findMinNode(node.right);
        node.item = aux.item;
        node.right = this.removeNode(node.right, aux.item);
      }
    }
    return node;
  }
  // 向平衡二叉搜索树中查找最小的节点
  findMinNode(node) {
    if (node.left === null) {
      return node;
    }
    return this.findMinNode(node.left);
  }
}

// 节点
class Node {
  constructor(item, left = null, right = null) {
    this.item = item;
    this.left = left;
    this.right = right;
  }
}
var tree = new BST(function (a, b) {
  return b - a;
});


tree.add(3);
tree.add(2);
tree.add(2);

tree.add(6);
tree.add(1);

tree.add(3);

tree.add(98);

// 先序遍历
function preOrder(node) {
  if (node !== null) {
    console.log(node.item);
    preOrder(node.left);
    preOrder(node.right);
  }
}
// 中序遍历
function inOrder(node) {
  if (node !== null) {
    inOrder(node.left);
    console.log(node.item);
    inOrder(node.right);
  }
}
// 后序遍历
function postOrder(node) {
  if (node !== null) {
    postOrder(node.left);
    postOrder(node.right);
    console.log(node.item);
  }
}

inOrder(tree.root);




