// tslint:disable:no-expression-statement
import test from 'ava';
import * as messages from './messages';

test('listVersions', t => {
  const expected = `
@ezy/nuxt-renderer versions:

1.0.0
2.0.0

to install run:
npm i node_modules/@ezy/nuxt-renderer-extractor/generated/VERSION
`;
  t.is(messages.listVersions(['1.0.0', '2.0.0']), expected);
});

test('commandNotRecognized', t => {
  const expected = `
invalid 'list' command
`;
  t.is(messages.commandNotRecognized('list'), expected);
});
