// tslint:disable:no-expression-statement
import test from 'ava';
import { create as createGenerate } from './generate';
import * as messages from './messages';

test('nuxt Not Found', t => {
  const generate = createGenerate({
    extract: () => Promise.resolve(),
    log: () => {
      /* */
    },
    require: () => ({}),
    resolve: () => {
      throw new Error('not found');
    }
  });

  return generate().catch(reason => {
    t.is(reason, messages.nuxtNotFound);
  });
});

test('generation succeed', t => {
  const logs = [];
  const fakePkg = { version: '1.0.0' };

  const generate = createGenerate({
    extract: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    require: () => fakePkg,
    resolve: () => 'path/to/nuxt'
  });

  return generate().then(() => {
    t.deepEqual(logs, [
      messages.nuxtFound(fakePkg.version),
      messages.packageBuilding(fakePkg.version),
      messages.packageBuildedSuccessfully(fakePkg.version)
    ]);
  });
});
