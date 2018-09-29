export const help = `
Usage

  Generate:
  $ npx ezy-nre generate

  List generated versions:
  $ npx ezy-nre list
`;

export const noVersion = `
no @ezy/nuxt-renderer version generated.

to generate a version run:
npx ezy-nre generate
`;

export const listVersions = (versions: string[]) => `
@ezy/nuxt-renderer versions:

${versions.join('\n')}

to install run:
npm i node_modules/@ezy/nuxt-renderer-extractor/generated/VERSION
`;

export const commandNotFound = `
command not found
`;

export const commandNotRecognized = (command: string) => `
invalid '${command}' command
`;

export const operationFailedForUnexpectedReason = (reason: string) => `
Operation failed for unexpected reason: 
${reason}
`;

export const nuxtFound = (version: string) => `
nuxt@${version} found`;

export const nuxtNotFound = `
nuxt is not installed
`;

export const packageBuilding = (version: string) => `
bulding @ezy/nuxt-renderer@${version}...`;

export const packageBuildedSuccessfully = (version: string) => `
package @ezy/nuxt-renderer@${version} successfully generated.

↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
to install run:
npm i node_modules/@ezy/nuxt-renderer-extractor/generated/${version}
↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

`;
