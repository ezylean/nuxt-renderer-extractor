// tslint:disable:no-console
import meow from 'meow';
import { join } from 'path';
import { ls } from 'shelljs';
import { generate } from './generate';
import * as messages from './messages';

export type CreateCommandParser = (
  help: string,
  conf: { [key: string]: any }
) => {
  input: string[];
  flags: { [key: string]: any };
  showHelp: (exitCode?: number) => void;
  [key: string]: any;
};

const config = {
  flags: {}
};

export interface Dependencies {
  generate: () => Promise<void>;
  ls: (path: string) => string[];
  createCommandParser: CreateCommandParser;
  log: (text: string) => void;
}

/**
 * CLI Run factory
 *
 * @param deps                        dependencies
 * @param deps.generate               generate function or alternative: [[generate]]
 * @param deps.ls                     shelljs ls function or alternative: [[http://documentup.com/shelljs/shelljs#lsoptions-path-]]
 * @param deps.createCommandParser    meow function or alternative: [[https://github.com/sindresorhus/meow#meowoptions-minimistoptions]]
 * @param deps.log                    console.log or alternative
 * @returns run function
 */
export function create(deps: Dependencies) {
  return () => {
    const result = deps.createCommandParser(messages.help, config);
    const command = result.input[0];

    const selfPath = join(__dirname, '..', '..', '..');

    if (command === 'list') {
      const versions = deps.ls(join(selfPath, 'generated'));
      if (versions.length === 0) {
        deps.log(messages.noVersion);
      } else {
        deps.log(messages.listVersions(versions));
      }
    } else if (command === 'generate') {
      return deps.generate().catch(reason => {
        if (reason === messages.nuxtNotFound) {
          deps.log(messages.nuxtNotFound);
        } else {
          throw new Error(messages.operationFailedForUnexpectedReason(reason));
        }
      });
    } else {
      deps.log(
        command
          ? messages.commandNotRecognized(command)
          : messages.commandNotFound
      );
      result.showHelp();
    }
    return Promise.resolve();
  };
}

/**
 * Run the CLI
 *
 * @returns Promise   this promise resolve when everything is done.
 */
export const run = create({
  createCommandParser: meow,
  generate,
  log: console.log,
  ls
});
