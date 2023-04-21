const babel = require("@babel/core");

const babelGenerator = require("@babel/generator").default;

const babelParser = require("@babel/parser");

const babelTraverse = require("@babel/traverse").default;

babel.traverse = babelTraverse;

babel.babelParser = babelParser.parse;

babel.generate = babelGenerator;

let ss = babelGenerator(babelParser.parse("let a = 1;"), {
  minified: true,
  sourceMaps: true,
  comments: true,
});

babel.transform("let a = 1;", {
  ast: true,
  targets: {
    browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
  },
  env:{
    
  },
});

module.exports = babel;
