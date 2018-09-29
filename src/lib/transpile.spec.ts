// tslint:disable:no-expression-statement
import test from 'ava';
import { create as createTranspile } from './transpile';

test('commandNotFound', t => {
  const transpile = createTranspile({
    ensureDir: () => Promise.resolve(),
    exec: () => ({}),
    rm: () => {
      /* */
    }
  });

  transpile('from/path', 'to/path');

  t.is(true, true);
});
