// tslint:disable:no-expression-statement
import test from 'ava';
import { create as createGetImportsDeep } from './getImportsDeep';

test('simple', t => {
  const getImportsDeep = createGetImportsDeep({
    getSource: () => '',
    resolve: () => ''
  });

  const expected = {
    dependencies: [],
    files: ['index.js']
  };

  t.deepEqual(getImportsDeep('index.js'), expected);
});

test('nested', t => {
  const getImportsDeep = createGetImportsDeep({
    getSource: path => {
      if (path === 'index.js') {
        return `
        import './lib/nested'
        import * as pkg from './package.json'
        `;
      } else {
        return '';
      }
    },
    resolve: relativePath =>
      relativePath === 'package.json' ? relativePath : `${relativePath}.js`
  });

  const expected = {
    dependencies: [],
    files: ['index.js', 'lib/nested.js', 'package.json']
  };

  t.deepEqual(getImportsDeep('index.js'), expected);
});
