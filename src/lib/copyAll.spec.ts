// tslint:disable:no-expression-statement
import test from 'ava';
import { create as createCopyAll } from './copyAll';

test('commandNotFound', t => {
  const copyAll = createCopyAll(() => Promise.resolve());

  const files = [];

  return copyAll('/src/path', '/dest/path', files).then(() => {
    t.pass();
  });
});
