import * as fs from 'fs-extra';
import { exec, rm } from 'shelljs';

/**
 * transpile function factory
 *
 * @param deps                dependencies
 * @param deps.ensureDir      fs-extra ensureDir function or alternative: [[https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md]]
 * @param deps.rm             shellsjs rm function or alternative: [[https://github.com/shelljs/shelljs#rmoptions-file--file-]]
 * @param deps.exec           shellsjs exec function or alternative: [[https://github.com/shelljs/shelljs#execcommand--options--callback]]
 * @returns                   transpile function
 */
export function create(deps: {
  exec: (command: string) => any;
  ensureDir: (path: string) => Promise<void>;
  rm: (option: string, ...files: string[]) => void;
}) {
  return (from: string, to: string) => {
    return deps
      .ensureDir(to)
      .then(() => {
        deps.exec(`babel -D -d ${to} ${from} --quiet`);
      })
      .then(() => deps.rm('-rf', from));
  };
}

/**
 * transpile source code in a folder into another
 *
 * @param from     source folder
 * @param to       destination folder
 * @returns        promise when everything finished
 */
export const transpile = create({
  ensureDir: fs.ensureDir,
  exec,
  rm
});
