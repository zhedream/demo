// var data = [
//   [
//     {
//       "GroupID": "e7543920-d98b-4c57-8731-20f022b3b51c",
//       "GroupCode": "ceshi2",
//       "GroupName": "测试2",
//       "UpdateUserName": "admin",
//       "UpdateTime": "2021-08-13 14:16:53",
//       "label": "测试2",
//       "value": "ceshi2",
//       "children": [
//         {
//           "ID": "2e4c81d5-1892-49f0-833a-7ab993be1f50",
//           "PollutantCode": "a240741",
//           "PollutantName": "戊烯",
//           "Unit": "ppb",
//           "DeviceType": "43",
//           "Sorts": "烃类",
//           "label": "戊烯",
//           "value": "a240741-43"
//         },
//         {
//           "ID": "cd97ca44-0931-4658-95e6-62b8928e5813",
//           "PollutantCode": "a240131",
//           "PollutantName": "单萜烯",
//           "Unit": "ppb",
//           "DeviceType": "43",
//           "Sorts": "烃类",
//           "label": "单萜烯",
//           "value": "a240131-43"
//         }
//       ]
//     },
//     {
//       "GroupID": "e2d7b8ba-1043-48b8-9138-3d226b96b3ad",
//       "GroupCode": "ceshi1",
//       "GroupName": "测试1",
//       "UpdateUserName": "admin",
//       "UpdateTime": "2021-08-13 14:02:24",
//       "label": "测试1",
//       "value": "ceshi1",
//       "children": [
//         {
//           "ID": "032ae76a-6990-41bd-9ba3-ce20e6d1e0ee",
//           "PollutantCode": "a24042",
//           "PollutantName": "己烷",
//           "Unit": "ppb",
//           "DeviceType": "43",
//           "Sorts": "烃类",
//           "label": "己烷",
//           "value": "a24042-43"
//         },
//         {
//           "ID": "26c1d9e8-07f6-4208-8959-d4dafddebe7f",
//           "PollutantCode": "a24053",
//           "PollutantName": "丙烯",
//           "Unit": "ppb",
//           "DeviceType": "43",
//           "Sorts": "烃类",
//           "label": "丙烯",
//           "value": "a24053-43"
//         }
//       ]
//     },
//     {
//       "GroupID": "f1d87aee-c4e6-4d1f-98f6-0f8e60acb8a1",
//       "GroupCode": "Group002",
//       "GroupName": "分组002",
//       "UpdateUserName": "admin",
//       "UpdateTime": "2021-08-11 14:19:38",
//       "label": "分组002",
//       "value": "Group002",
//       "children": [
//         {
//           "ID": "a9b97ea9-bdaa-40ea-8120-901ffdb21311",
//           "PollutantCode": "a05014",
//           "PollutantName": "二氯四氟乙烷",
//           "Unit": "ppb",
//           "DeviceType": "43",
//           "Sorts": "卤代烃",
//           "label": "二氯四氟乙烷",
//           "value": "a05014-43"
//         }
//       ]
//     },
//     {
//       "GroupID": "88ff0dbc-da3c-41a2-8dc3-291171746384",
//       "GroupCode": "radiation",
//       "GroupName": "辐射",
//       "UpdateUserName": "admin",
//       "UpdateTime": "2021-08-11 13:01:14",
//       "label": "辐射",
//       "value": "radiation",
//       "children": [
//         {
//           "ID": "2c466c07-b81e-4465-a0bf-4586c97bfe19",
//           "PollutantCode": "a04003",
//           "PollutantName": "太阳辐射强度",
//           "Unit": "w/m2",
//           "DeviceType": "30",
//           "Sorts": "",
//           "label": "太阳辐射强度",
//           "value": "a04003-30"
//         },
//         {
//           "ID": "d442aaf7-b41e-4c65-a0d5-92d4564f0c52",
//           "PollutantCode": "a04004",
//           "PollutantName": "紫外辐射",
//           "Unit": "w/m2",
//           "DeviceType": "30",
//           "Sorts": "",
//           "label": "紫外辐射",
//           "value": "a04004-30"
//         }
//       ]
//     }
//   ]
// ]

// 先序遍历树
export function treesForeach(
  tree,
  func,
  preRoot = null,
  level = 1,
  prePath = []
) {
  tree.forEach((root, index) => {
    const path = prePath.concat(index);
    func(root, preRoot, level, path);
    root.children && treesForeach(root.children, func, root, level + 1, path);
  });
}

// 构建 pid
function handleTreePid(tree, pid = 0, pidForm = "value", pidKey = "pid") {
  tree.forEach((root) => {
    root[pidKey] = pid;
    root.children &&
      handleTreePid(root.children, root[pidForm], pidForm, pidKey);
  });
}

// 标记 IndexPath, 用于查询, 变动需重新标记
function handleTreeIndexPath(tree, path, slash = "$") {
  tree.forEach((root, index) => {
    root["path"] = path == null ? index + "" : path + slash + index;
    root.children && handleTreeIndexPath(root.children, root["path"], slash);
  });
}
// 获取 paths : splitPaths('0$0$1') => ['0','0$0','0$0$1']
function splitPaths(path, slash = "$") {
  const arr = path.split(slash);
  let res = arr.reduce((acc, item, index) => {
    if (index == 0) {
      acc.push(item);
      return acc;
    }
    const last = acc[acc.length - 1];
    acc.push(last + "$" + item);
    return acc;
  }, []);
  return res;
}

// 通过 IndexPath 获取 item
function getTteeItemByPath(tree, path, slash) {
  let arr = [];

  if (typeof path == "string") arr = path.split(slash);
  else if (Array.isArray(path)) arr = path;

  const [firstIndex, ...indexs] = arr;

  indexs.reverse();

  let root = tree[firstIndex];
  let index;
  while ((index = indexs.pop())) {
    console.log("index: ", index);
    if (root.children) {
      root = root.children[index];
    } else {
      root = undefined;
      break;
    }
  }
  console.log("root: ", root);
  return root;
}

// 标记 叶节点, 判断有无 children
function handleTreeleaf(tree) {
  tree.forEach((root) => {
    root["isLeaf"] = root.children == undefined;
    root.children &&
      handleTreePid(root.children, root[pidForm], pidForm, pidKey);
  });
}

/**
 * 转树结构
 * @param {*} arr
 * @returns
 */
export function arrayToTree(arr) {
  const PIDKey = "pid";
  const IDKey = "id";
  const ChildrenKey = "children";

  // const allHaveChildren = false;
  // if (allHaveChildren === true) {
  //   arr.forEach(v => v[ChildrenKey] = [])
  // }

  let res = [];

  arr.forEach((child) => {
    let hasParent = arr.some((parent) => {
      if (child[PIDKey] === parent[IDKey]) {
        if (parent[ChildrenKey] === undefined) {
          parent[ChildrenKey] = [child];
        } else {
          parent[ChildrenKey].push(child);
        }
        return true;
      }
    });

    if (hasParent === false) {
      res.push(child);
    }
  });

  return res;
}

// 构建 树
function listToTree(list) {
  const PID = "pid";
  const ID = "id";
  const CHILDREN = "children";
  let info = {};
  list.forEach((item) => {
    info[item[ID]] = item;
  });

  const tree = list.filter((node) => {
    if (info[node[PID]]) {
      if (info[node[PID]][CHILDREN] == undefined)
        info[node[PID]][CHILDREN] = [];
      info[node[PID]][CHILDREN].push(node);
    } else {
      return true; // 不存在 PID 提到顶级节点
    }
    return node[PID] == 0 || node[PID] == "0"; // 顶级节点
  });
  return tree;
}

// 标记 叶节点, pid, indexPath
function handleTrees(tree, func, indexPath, pid = "0", slash = "$") {
  tree.forEach((root, index) => {
    root["value"] = root["value"] || "其他";
    root["label"] = root["label"] || "其他";
    //
    root["id"] = root["value"]; // id
    root["pid"] = pid; // 父级 id
    root["indexPath"] = indexPath == undefined ? index + "" : indexPath + slash + index; // 查询path
    root["isLeaf"] = root.children == undefined; // 是否叶节点
    func(root);
    root.children && handleTrees(root.children, func, root["indexPath"], root["value"], slash);
  });
}

// 重构树 for search
function rebuildTree(allMap, LeafList) {
  let list = [];

  let pathSet = new Set();

  LeafList.forEach((item) => {
    const paths = splitPaths(item.path);
    paths.forEach((v) => pathSet.add(v));
  });
  pathSet.forEach((path) => {
    list.push(allMap[path]);
  });
  // console.log('pathSet: ', pathSet);
  const tree = listToTree(list);
  console.log("list: ", list);
  console.log("tree: ", tree);
  // console.log(JSON.stringify(tree))
  return tree;
}

// 节点最大深度
export function maxDepth(root) {
  // console.log('root: ', root);
  if (root == null) return 0;
  let max = 0;
  root.children &&
    root.children.forEach((item) => {
      max = Math.max(maxDepth(item), max);
    });
  return max + 1;
}

// let allMap = {}; // 节点映射
// let LeafList = []; // 叶节点
// handleTree(data[0], (root) => {
//   if (root.isLeaf) {
//     LeafList.push(root)
//     allMap[root.path] = Object.assign({}, root, { children: undefined });
//   } else {
//     allMap[root.path] = Object.assign({}, root, { children: [] });
//   }
// });
// const text = '丙烷'
// let listNext = LeafList.filter(v => {
//   return v.label.includes(text) || v.label.includes(text)
// })
// rebuildTree(allMap, listNext)
