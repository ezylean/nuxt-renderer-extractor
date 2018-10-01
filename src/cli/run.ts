// tslint:disable:no-console interface-over-type-literal
import meow from 'meow';
import { join } from 'path';
import { ls } from 'shelljs';
import { generate } from './generate';
import * as messages from './messages';

export type ParseCLArgs = (
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

export type Dependencies = {
  generate: () => Promise<void>;
  ls: (path: string) => string[];
  parseCLArgs: ParseCLArgs;
  log: (text: string) => void;
};

/**
 * CLI Run factory
 *
 * @param deps                        dependencies
 * @param deps.generate               generate function or alternative: [[generate]]
 * @param deps.ls                     shelljs ls function or alternative: [[http://documentup.com/shelljs/shelljs#lsoptions-path-]]
 * @param deps.parseCLArgs            meow function or alternative: [[https://github.com/sindresorhus/meow#meowoptions-minimistoptions]]
 * @param deps.log                    console.log or alternative
 * @returns run function
 */
export function create(deps: Dependencies) {
  return () => {
    const CLArgs = deps.parseCLArgs(messages.help, config);
    const command = CLArgs.input[0];

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
      CLArgs.showHelp();
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
  generate,
  log: console.log,
  ls,
  parseCLArgs: meow
});
