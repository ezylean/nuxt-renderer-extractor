// tslint:disable:no-expression-statement
import test from 'ava';
import { recLoop } from './recLoop';

test('basic', t => {
  const result = recLoop('/index', path => {
    if (path === '/index') {
      return {
        seeds: ['./submod'],
        values: []
      };
    } else if (path === './submod') {
      return {
        seeds: [],
        values: ['subMod1']
      };
    } else {
      return {
        seeds: [],
        values: []
      };
    }
  });

  const expected = {
    seeds: ['/index', './submod'],
    values: ['subMod1']
  };
  t.deepEqual(result, expected);
});

test('real world', t => {
  const result = recLoop('/index', path => {
    if (path === '/index') {
      return {
        seeds: [
          '../common',
          '../common/utils',
          '../../package.json',
          './module',
          './renderer'
        ],
        values: [
          'debug',
          'server-destroy',
          'module',
          'lodash',
          'chalk',
          'fs-extra',
          'path'
        ]
      };
    } else if (path === './module') {
      return {
        seeds: ['./subsubmodule'],
        values: ['subMod1']
      };
    } else if (path === './subsubmodule') {
      return {
        seeds: [],
        values: ['subMod2']
      };
    } else {
      return {
        seeds: [],
        values: []
      };
    }
  });

  const expected = {
    seeds: [
      '/index',
      '../common',
      '../common/utils',
      '../../package.json',
      './module',
      './renderer',
      './subsubmodule'
    ],
    values: [
      'debug',
      'server-destroy',
      'module',
      'lodash',
      'chalk',
      'fs-extra',
      'path',
      'subMod1',
      'subMod2'
    ]
  };
  t.deepEqual(result, expected);
});
