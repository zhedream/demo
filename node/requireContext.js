const filesObj = {};

const files = require.context("./data", false, /\.json$/);
files.keys().forEach((key) => {
  filesObj[key] = files(key);
});

let path = "./data/1.json";

let res = filesObj[path];
