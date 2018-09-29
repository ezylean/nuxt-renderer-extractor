// tslint:disable:no-expression-statement
import test from 'ava';
import { create as createExtract } from './extract';

test('simple', t => {
  const extract = createExtract({
    copy: () => Promise.resolve(),
    readFileSync: () => '',
    require: () => ({}),
    resolve: () => '',
    transpile: () => Promise.resolve(),
    writeFile: () => Promise.resolve()
  });

  return extract('nuxt', 'partial-nuxt', '/dest/path', `import 'mod';`).then(
    () => {
      t.pass();
    }
  );
});

test('nested', t => {
  const extract = createExtract({
    copy: () => Promise.resolve(),
    readFileSync: () => '',
    require: () => ({}),
    resolve: relativePath => `${relativePath}.js`,
    transpile: () => Promise.resolve(),
    writeFile: () => Promise.resolve()
  });

  return extract(
    'nuxt',
    'partial-nuxt',
    '/dest/path',
    `import './nested';`
  ).then(() => {
    t.pass();
  });
});
