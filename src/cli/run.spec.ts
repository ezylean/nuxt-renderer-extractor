// tslint:disable:no-expression-statement
import test from 'ava';
import * as messages from './messages';
import { create as createRun } from './run';

test('list command - not found', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['list'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().then(() => {
    t.deepEqual(logs, [messages.noVersion]);
  });
});

test('list command', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['list'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    ls: () => ['1.0.0', '2.0.0']
  });

  return run().then(() => {
    t.deepEqual(logs, [messages.listVersions(['1.0.0', '2.0.0'])]);
  });
});

test('generate command - nuxt not found', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['generate'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.reject(messages.nuxtNotFound),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().then(() => {
    t.deepEqual(logs, [messages.nuxtNotFound]);
  });
});

test('generate command - failed', t => {
  const logs = [];
  const err = new Error('something just break');

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['generate'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.reject(err),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().catch(error => {
    t.deepEqual(
      error.message,
      messages.operationFailedForUnexpectedReason(err.toString())
    );
  });
});

test('generate command', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['generate'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().then(() => {
    t.deepEqual(logs, []);
  });
});

test('command - not found', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: [],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().then(() => {
    t.deepEqual(logs, [messages.commandNotFound, messages.help]);
  });
});

test('command - not recognized', t => {
  const logs = [];

  const run = createRun({
    createCommandParser: () => ({
      flags: {},
      input: ['ghost'],
      showHelp: () => logs.push(messages.help)
    }),
    generate: () => Promise.resolve(),
    log: (text: string) => logs.push(text),
    ls: () => []
  });

  return run().then(() => {
    t.deepEqual(logs, [messages.commandNotRecognized('ghost'), messages.help]);
  });
});
