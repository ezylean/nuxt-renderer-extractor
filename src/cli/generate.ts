// tslint:disable:no-console interface-over-type-literal
import { join } from 'path';
import { extract } from '../lib/extract';
import * as messages from './messages';

export type Dependencies = {
  extract: (
    moduleName: string,
    newModuleName: string,
    destPath: string,
    indexSource: string
  ) => Promise<void>;
  log: (text: string) => void;
  require: (relativePath: string) => any;
  resolve: (relativePath: string) => string;
};

/**
 * generate function factory
 *
 * @param deps                        dependencies
 * @param deps.extract                extract function or alternative: [[extract]]
 * @param deps.require                nodejs require function or alternative
 * @param deps.resolve                nodejs require.resolve function or alternative: [[https://nodejs.org/api/modules.html#modules_require_resolve_request_options]]
 * @param deps.log                    console.log or alternative
 * @returns generate function
 */
export function create(deps: Dependencies) {
  return () => {
    try {
      deps.resolve('nuxt');
    } catch (e) {
      return Promise.reject(messages.nuxtNotFound);
    }

    const selfPath = join(__dirname, '..', '..', '..');
    const nuxtPackage: any = deps.require(join('nuxt', 'package.json'));

    deps.log(messages.nuxtFound(nuxtPackage.version));

    const buildpath = join(selfPath, 'generated', nuxtPackage.version);
    const entrypoint = `import Nuxt from './lib/core/nuxt'
    export { Nuxt }
    `;

    deps.log(messages.packageBuilding(nuxtPackage.version));

    return deps
      .extract('nuxt', '@ezy/nuxt-renderer', buildpath, entrypoint)
      .then(() => {
        deps.log(messages.packageBuildedSuccessfully(nuxtPackage.version));
      });
  };
}

/**
 * generate @ezy/nuxt-renderer package
 *
 * @returns Promise   this promise resolve when everything is done.
 */
export const generate = create({
  extract,
  log: console.log,
  require,
  resolve: require.resolve
});
