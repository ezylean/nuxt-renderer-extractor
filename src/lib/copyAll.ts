import * as fs from 'fs-extra';

/**
 * copyAll function factory
 *
 * @param copy           fs-extra copy function or alternative: [[https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md]]
 * @returns              copyAll function
 */
export function create(copy: (from: string, to: string) => Promise<void>) {
  return (fromDir: string, toDir: string, paths: string[]) =>
    Promise.all(paths.map(path => copy(path, path.replace(fromDir, toDir))));
}

/**
 * copy all files from a directory to another
 *
 * @param fromDir              source directory
 * @param toDir                dest directory
 * @param paths                list of files to copy (absolute paths)
 * @returns Promise            this promise resolve when everything is done.
 */
export const copyAll = create(fs.copy);
