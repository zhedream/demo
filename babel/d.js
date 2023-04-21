const babel = require("@babel/core");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const code = `
import * as M2 from 'javascript/menu2.m.js';
import menu,{find} from 'javascript/menu.m.js';
console.log(123);
export const a = 1;
`;

// 1. 使用 @babel/parser 解析源代码生成 AST
const ast = parser.parse(code, {
  sourceType: "module",
});

// 2. 使用 @babel/traverse 遍历 AST 并进行代码的增删改

traverse(ast, {
  ImportDeclaration(path) {
    const importSource = path.node.source.value;
    const defaultSpecifier = path.node.specifiers.find(specifier =>
      t.isImportDefaultSpecifier(specifier)
    );
    const namedSpecifiers = path.node.specifiers.filter(specifier =>
      t.isImportSpecifier(specifier)
    );
    const namespaceSpecifier = path.node.specifiers.find(specifier =>
      t.isImportNamespaceSpecifier(specifier)
    );

    const tempIdentifier = path.scope.generateUidIdentifierBasedOnNode(
      t.identifier(importSource)
    );

    const importBinding = t.variableDeclarator(
      tempIdentifier,
      t.awaitExpression(
        t.callExpression(t.identifier("loadModule"), [
          t.stringLiteral(importSource),
        ])
      )
    );

    const defaultBinding = defaultSpecifier
      ? t.variableDeclarator(
          defaultSpecifier.local,
          t.memberExpression(tempIdentifier, t.identifier("default"))
        )
      : null;

    const namedBindings = namedSpecifiers.length
      ? t.variableDeclarator(
          t.objectPattern(
            namedSpecifiers.map(specifier =>
              t.objectProperty(specifier.imported, specifier.local)
            )
          ),
          tempIdentifier
        )
      : null;

    const namespaceBinding = namespaceSpecifier
      ? t.variableDeclarator(
          namespaceSpecifier.local,
          t.awaitExpression(
            t.callExpression(t.identifier("loadModule"), [
              t.stringLiteral(importSource),
            ])
          )
        )
      : null;

    const variableDeclarations = [
      importBinding,
      ...(defaultBinding ? [defaultBinding] : []),
      ...(namedBindings ? [namedBindings] : []),
      ...(namespaceBinding ? [namespaceBinding] : []),
    ];

    if (variableDeclarations.length) {
      path.replaceWithMultiple(
        variableDeclarations.map(declarator =>
          t.variableDeclaration("const", [declarator])
        )
      );
    } else {
      path.remove();
    }
  },

  ExportNamedDeclaration(path) {
    if (path.node.declaration) {
      path.replaceWith(path.node.declaration);
    }
  },
});


// 3. 使用 @babel/generator 将 AST 转换回代码
const { code: newCode } = generator(ast, {});

console.log("源代码：");
console.log(code);
console.log("转换后的代码：");
console.log(newCode);



