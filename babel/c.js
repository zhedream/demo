const parser = require('@babel/parser');
const generator = require('@babel/generator');

const code = `
import * as treeHelper from "javascript/treeHelper.m.js";
import { findPath, find2 } from "javascript/treeHelper.m.js";
console.log(123);
export const a = 1;
`;

const ast = parser.parse(code, {
  sourceType: 'module',
});


// updateImport1(ast);
updateImport2(ast);

const newCode = generator.default(ast).code;

console.log(code);
console.log(newCode);

function updateImport1(ast) {
  const imports = ast.program.body.filter((node) => node.type === 'ImportDeclaration');

  const importStatements = [];

  for (const importDeclaration of imports) {
    const moduleName = importDeclaration.source.value;

    if (importDeclaration.specifiers[0].type === 'ImportNamespaceSpecifier') {
      const newImportStatement = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: importDeclaration.specifiers[0].local.name,
            },
            init: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'loadModule',
                },
                arguments: [
                  {
                    type: 'StringLiteral',
                    value: moduleName,
                  },
                ],
              },
            },
          },
        ],
      };

      importStatements.push(newImportStatement);
    } else {
      const specifiers = importDeclaration.specifiers.map((specifier) => {
        return {
          type: 'ObjectProperty',
          key: {
            type: 'Identifier',
            name: specifier.imported.name,
          },
          value: {
            type: 'Identifier',
            name: specifier.local.name,
          },
          computed: false,
          shorthand: specifier.imported.name === specifier.local.name,
        };
      });

      const newImportStatement = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'ObjectPattern',
              properties: specifiers,
            },
            init: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'loadModule',
                },
                arguments: [
                  {
                    type: 'StringLiteral',
                    value: moduleName,
                  },
                ],
              },
            },
          },
        ],
      };

      importStatements.push(newImportStatement);
    }
  }

  ast.program.body = importStatements.concat(ast.program.body.filter((node) => node.type !== 'ImportDeclaration'));

  return ast;
}

function updateImport2(ast) {
  const imports = ast.program.body.filter((node) => node.type === 'ImportDeclaration');

  const importStatements = [];

  for (const importDeclaration of imports) {
    const moduleName = importDeclaration.source.value;

    if (importDeclaration.specifiers[0].type === 'ImportNamespaceSpecifier') {
      const newImportStatement = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: importDeclaration.specifiers[0].local.name,
            },
            init: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'loadModule',
                },
                arguments: [
                  {
                    type: 'StringLiteral',
                    value: moduleName,
                  },
                ],
              },
            },
          },
        ],
      };

      importStatements.push(newImportStatement);
    } else if (importDeclaration.specifiers[0].type === 'ImportSpecifier') {
      const namedSpecifiersObjectPattern = {
        type: 'ObjectPattern',
        properties: importDeclaration.specifiers.map((specifier) => {
          return {
            type: 'ObjectProperty',
            key: {
              type: 'Identifier',
              name: specifier.imported.name,
            },
            value: {
              type: 'Identifier',
              name: specifier.local.name,
            },
            computed: false,
            shorthand: specifier.imported.name === specifier.local.name,
          };
        }),
      };

      const newImportStatement = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'ObjectPattern',
              properties: [
                {
                  type: 'ObjectProperty',
                  key: {
                    type: 'Identifier',
                    name: importDeclaration.specifiers[0].local.name,
                  },
                  value: namedSpecifiersObjectPattern,
                  computed: false,
                  shorthand: false,
                },
              ],
            },
            init: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'loadModule',
                },
                arguments: [
                  {
                    type: 'StringLiteral',
                    value: moduleName,
                  },
                ],
              },
            },
          },
        ],
      };

      importStatements.push(newImportStatement);
    }
  }

  ast.program.body = importStatements.concat(ast.program.body.filter((node) => node.type !== 'ImportDeclaration'));

  return ast;
}

function updateImport3(ast) {
 // 转换: import Menu,{item,item2} from 'javascript/menu.m.js';

}