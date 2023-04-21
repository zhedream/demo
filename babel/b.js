const parser = require('@babel/parser');
const generator = require('@babel/generator');

const code = `
import { findPath } from "javascript/treeHelper.m.js";
console.log(123);
export const a = 1;
`;

const ast = parser.parse(code, {
  sourceType: 'module',
});

const imports = ast.program.body.filter((node) => node.type === 'ImportDeclaration');

const importReplacements = imports.map((importDeclaration) => {
  const moduleName = importDeclaration.source.value;

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

  const newImportDeclaration = {
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

  return {
    start: importDeclaration.start,
    end: importDeclaration.end,
    newCode: generator.default(newImportDeclaration).code,
  };
});

const newCodeFragments = [];

let lastIndex = 0;
for (const replacement of importReplacements) {
  newCodeFragments.push(code.slice(lastIndex, replacement.start));
  newCodeFragments.push(replacement.newCode);
  lastIndex = replacement.end + 1;
}

newCodeFragments.push(code.slice(lastIndex));

const newCode = newCodeFragments.join('');

console.log(code);
console.log(newCode);
