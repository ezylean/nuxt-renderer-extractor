import builtinModules from 'builtin-modules';
import * as fs from 'fs-extra';
import { join, parse } from 'path';
import { difference } from 'ramda';
import { create as createCopyAll } from './copyAll';
import { create as createGetImportsDeep } from './getImportsDeep';
import { transpile } from './transpile';

export interface Dependencies {
  copy: (from: string, to: string) => Promise<void>;
  resolve: (relativePath: string) => string;
  require: (relativePath: string) => any;
  readFileSync: (path: string, encoding: string) => any;
  writeFile: (path: string, content: string) => Promise<void>;
  transpile: (from: string, to: string) => Promise<void>;
}

function defaultCreatePackageJSON(
  pkgName: string,
  dependencies: string[],
  pkg: { [key: string]: any }
): { [key: string]: any } {
  const versions = {
    ...pkg.devDependencies,
    ...pkg.dependencies
  };

  return {
    dependencies: dependencies.reduce((all, name) => {
      all[name] = versions[name];
      return all;
    }, {}),
    devDependencies: {},
    main: 'dist/index.js',
    name: pkgName,
    version: pkg.version
  };
}

/**
 * extract function factory
 *
 * @param deps                        dependencies
 * @param deps.copy                   fs-extra copy function or alternative: [[https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md]]
 * @param deps.writeFile              fs-extra writeFile function or alternative: [[https://github.com/jprichardson/node-fs-extra/blob/master/docs/fs-read-write.md]]
 * @param deps.require                nodejs require function or alternative
 * @param deps.resolve                nodejs require.resolve function or alternative: [[https://nodejs.org/api/modules.html#modules_require_resolve_request_options]]
 * @param deps.readFileSync           fs readFileSync function or alternative: [[https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options]]
 * @param deps.transpile              transpile function or alternative: [[transpile]]
 *
 * @returns extract function
 */
export function create(deps: Dependencies) {
  return (
    moduleName: string,
    newModuleName: string,
    destPath: string,
    indexSource: string,
    options = {
      createPackageJSON: defaultCreatePackageJSON
    }
  ) => {
    const packageJSONPath: string = deps.resolve(
      join(moduleName, 'package.json')
    );
    const packageJSON = deps.require(packageJSONPath);
    const packagePath = parse(packageJSONPath).dir;
    const indexPath = join(packagePath, 'index.js');

    const getImportsDeep = createGetImportsDeep({
      getSource: path => {
        if (path === indexPath) {
          return indexSource;
        }
        return deps.readFileSync(path, 'utf8');
      },
      resolve: deps.resolve
    });

    const imports = getImportsDeep(indexPath);

    const files = imports.files;
    const dependencies = difference(imports.dependencies, builtinModules);

    const copyAll = createCopyAll((from, to) => {
      if (from === indexPath) {
        return deps.writeFile(to, indexSource);
      }
      return deps.copy(from, to);
    });

    const createPackageJSON = options.createPackageJSON;

    return copyAll(packagePath, join(destPath, 'src'), files)
      .then(() => deps.transpile(join(destPath, 'src'), join(destPath, 'dist')))
      .then(() => createPackageJSON(newModuleName, dependencies, packageJSON))
      .then(pkg => JSON.stringify(pkg, null, 2))
      .then(json => deps.writeFile(join(destPath, 'package.json'), json));
  };
}

/**
 * extract a part of an installed package
 *
 * @param moduleName                      module to extract
 * @param newModuleName                   name of new package to generate
 * @param destPath                        package destination folder
 * @param indexSource                     js source code of the module entrypoint
 * @param options                         (optional)
 * @param options.createPackageJSON       function to generate package.json
 * @returns Promise                       this promise resolve when everything is done.
 */
export const extract = create({
  copy: fs.copy,
  readFileSync: fs.readFileSync,
  require,
  resolve: require.resolve,
  transpile,
  writeFile: fs.outputFile
});
