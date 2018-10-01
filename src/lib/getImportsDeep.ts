// tslint:disable:no-console interface-over-type-literal
import * as fs from 'fs-extra';
import { join, parse } from 'path';
import { partition, uniq } from 'ramda';
import { getImports } from './getImports';
import { recLoop } from './recLoop';

const isRelative = (mod: string) => mod.startsWith('.');
const isJS = (mod: string) => mod.endsWith('.js');

export type Dependencies = {
  resolve: (relativePath: string) => string;
  getSource: (path: string, encoding: string) => string;
};

/**
 * getImportsDeep function factory
 *
 * @param deps                dependencies
 * @param deps.getSource      fs-extra readFileSync function or alternative: [[https://github.com/jprichardson/node-fs-extra/blob/master/docs/fs-read-write.md]]
 * @param deps.resolve        nodejs require.resolve function or alternative: [[https://nodejs.org/api/modules.html#modules_require_resolve_request_options]]
 * @returns                   getImportsDeep function
 */
export function create(deps: Dependencies) {
  return (file: string): { files: string[]; dependencies: string[] } => {
    const result = recLoop(file, filePath => {
      const parsedPath = parse(filePath);

      if (isJS(parsedPath.base)) {
        const sourceCode = deps.getSource(filePath, 'utf8');
        const [relatives, absolutes]: string[][] = partition(
          isRelative,
          getImports(sourceCode)
        );

        return {
          seeds: relatives.map(mod => deps.resolve(join(parsedPath.dir, mod))),
          values: absolutes
        };
      }
      return { seeds: [], values: [] };
    });

    return {
      dependencies: uniq(result.values),
      files: uniq(result.seeds)
    };
  };
}

/**
 * Get recursively all files and dependencies of an ES6/Node module
 *
 * @param src     source code to parse
 * @returns       files and dependencies
 */
export const getImportsDeep = create({
  getSource: fs.readFileSync,
  resolve: require.resolve
});
