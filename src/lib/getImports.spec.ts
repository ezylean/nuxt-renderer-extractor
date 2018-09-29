// tslint:disable:no-expression-statement
import test from 'ava';
import { getImports } from './getImports';

test('import with no source', t => {
  try {
    // @ts-ignore
    getImports();
  } catch (e) {
    t.deepEqual(e, new Error('src not given'));
  }
});

test('import with source empty', t => {
  t.deepEqual(getImports(''), []);
});

test('invalid imports/exports', t => {
  t.deepEqual(getImports('import defaultImport from ""'), []);
  t.deepEqual(getImports('export * from ""'), []);
});

test('es6 imports', t => {
  const source = `import defaultImport from "default-import";
  import * as name from "all-imports";
  import { import1 } from "one-import";
  import { import1 as alias } from "aliased-import";
  import { import2 , import3 } from "multiple-imports";
  import { foo , bar } from "multiple-imports/relative/path";
  import { import4 , import1 as alias2 } from "multiple-aliased-imports";
  import defaultImport, { import5, import1 as alias3 } from "default-and-multiple-aliased-imports";
  import defaultImport, * as name2 from "default-and-all-import";
  import "global-import";
  var promise = import('function-style-import');`;

  const dependencies = getImports(source);
  t.deepEqual(dependencies, [
    'default-import',
    'all-imports',
    'one-import',
    'aliased-import',
    'multiple-imports',
    'multiple-imports/relative/path',
    'multiple-aliased-imports',
    'default-and-multiple-aliased-imports',
    'default-and-all-import',
    'global-import',
    'function-style-import'
  ]);
});

test('es6 exports', t => {
  const source = `export * from "all-exports";
  export { name1, name2, nameN } from "multiple-exports";
  export { import1 as name3, import2 as name4, nameN2 } from "multiple-aliased-exports";
  export { default } from "default-export";`;

  const dependencies = getImports(source);
  t.deepEqual(dependencies, [
    'all-exports',
    'multiple-exports',
    'multiple-aliased-exports',
    'default-export'
  ]);
});

test('node require', t => {
  const source = `const allImports = require("all-imports");
  const { name1, name2, nameN } = require("multiple-imports");
  const { import1, import2, import3 } = require("multiple-aliased-imports");
  const defaultImport = require("default-import").default;`;

  const dependencies = getImports(source);
  t.deepEqual(dependencies, [
    'all-imports',
    'multiple-imports',
    'multiple-aliased-imports',
    'default-import'
  ]);
});

test('node dynamic require', t => {
  const source = `let dynamicPath;
  require(dynamicPath);`;

  const dependencies = getImports(source);
  t.deepEqual(dependencies, []);
});

test('node real world require', t => {
  const source = `const Debug = require('debug')
  const enableDestroy = require('server-destroy')
  const Module = require('module')
  const { isPlainObject } = require('lodash')
  const chalk = require('chalk')
  const { existsSync } = require('fs-extra')
  const { Options } = require('../common')
  const { sequence, printError, printWarn } = require('../common/utils')
  const { resolve, join } = require('path')
  const { version } = require('../../package.json')
  const ModuleContainer = require('./module')
  const Renderer = require('./renderer')`;

  const dependencies = getImports(source);
  t.deepEqual(dependencies, [
    'debug',
    'server-destroy',
    'module',
    'lodash',
    'chalk',
    'fs-extra',
    '../common',
    '../common/utils',
    'path',
    '../../package.json',
    './module',
    './renderer'
  ]);
});
