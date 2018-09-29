<h1 align="center">
  <img src="https://fakeimg.pl/900x300/ffffff/333333/?text=nuxt+renderer+extractor&font=museo" alt="nuxt renderer extractor" width="900px" />
</h1>

<p align="center">extract rendering part of nuxt to produce lightweight bundle for cloud computing environments</p>

<p align="center">
<a href="https://opensource.org/licenses">
  <img src="https://img.shields.io/github/license/ezylean/nuxt-renderer-extractor.svg" alt="License" />
</a>
<a href="https://circleci.com/gh/ezylean/nuxt-renderer-extractor/tree/master">
  <img src="https://circleci.com/gh/ezylean/nuxt-renderer-extractor/tree/master.svg?style=shield" alt="CircleCI" />
</a>
<a href="https://codecov.io/gh/ezylean/nuxt-renderer-extractor">
  <img src="https://codecov.io/gh/ezylean/nuxt-renderer-extractor/branch/master/graph/badge.svg" alt="codecov" />
</a>
<a href="https://ezylean.github.io/nuxt-renderer-extractor">
  <img src="https://img.shields.io/badge/docs-typedoc-%239B55FC.svg" alt="Docs: typedoc" />
</a>
<a href="https://github.com/ezylean/nuxt-renderer-extractor/issues">
  <img src="https://img.shields.io/github/issues-raw/ezylean/nuxt-renderer-extractor.svg" alt="GitHub issues" />
</a>
<a href="https://codeclimate.com/github/ezylean/nuxt-renderer-extractor/maintainability" >
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/ezylean/nuxt-renderer-extractor.svg" alt="Maintainability" />
</a>
<a href="https://david-dm.org/ezylean/nuxt-renderer-extractor">
  <img src="https://david-dm.org/ezylean/nuxt-renderer-extractor.svg" alt="Dependencies status" />
</a>
<a href="https://david-dm.org/ezylean/nuxt-renderer-extractor?type=dev">
  <img src="https://david-dm.org/ezylean/nuxt-renderer-extractor/dev-status.svg" alt="Dev Dependencies status" />
</a>
<a href="https://github.com/Microsoft/TypeScript">
  <img src="https://img.shields.io/badge/made%20with-typescript-%234B9DD5.svg" alt="Made with: typescript" />
</a>
<a href="https://github.com/prettier/prettier">
  <img src="https://img.shields.io/badge/code%20style-prettier-ff69b4.svg" alt="Code style: prettier" />
</a>
</p>

## Why

The nuxt + serverless + AWS lambda combination could be really great, but serverless do not support tree-shaking and just exclude devDependencies.
As a result bundle produced with nuxt are really large (30-46 MB), way to close to AWS lambda deployment package size limit (50 MB).

To solve the problem this package extract just the nuxt renderer from your installed nuxt version and produce a drop-in place replacement package for nuxt.

## Install :

```shell
npm i --save-dev nuxt@VERSION
npm i --save-dev @ezy/nuxt-renderer-extractor
```

## API :

`@ezy/nuxt-renderer-extractor` aka `ezy-nre` have a small API with only 2 commands:

- `npx ezy-nre list` to list all generated versions of `@ezy/nuxt-renderer`

- `npx ezy-nre generate` to generate a version of `@ezy/nuxt-renderer` matching your `nuxt` package

## Usage :

```shell
npx ezy-nre generate
npm i node_modules/@ezy/nuxt-renderer-extractor/generated/VERSION
```

now your can replace nuxt imports with your shinny new renderer.

```js
// import { Nuxt } from 'nuxt'
import { Nuxt } from '@ezy/nuxt-renderer';
```

## Links

- [API docs](https://ezylean.github.io/nuxt-renderer-extractor)
