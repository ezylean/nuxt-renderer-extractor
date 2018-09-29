import Walker from 'node-source-walk';

/**
 *  Get the dependencies of an ES6/Node module
 *
 * @note: forked from 'detective-es6' to add support for node modules.
 * @param src source code to parse
 * @returns array of dependency paths/names
 * @see https://github.com/dependents/node-detective-es6
 */
export function getImports(src: string): string[] {
  const walker = new Walker();

  const dependencies = [];

  if (typeof src === 'undefined') {
    throw new Error('src not given');
  }

  if (src === '') {
    return dependencies;
  }

  walker.walk(src, node => {
    switch (node.type) {
      case 'ImportDeclaration':
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;
      case 'ExportNamedDeclaration':
      case 'ExportAllDeclaration':
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;
      case 'CallExpression':
        if (node.callee.type === 'Import' && node.arguments.length) {
          dependencies.push(node.arguments[0].value);
        } else if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          dependencies.push(node.arguments[0].value);
        }
        break;
      default:
        return;
    }
  });

  return dependencies;
}
