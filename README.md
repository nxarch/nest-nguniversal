<p align="center">
 <img width="75%" height="75%" src="nest-nguniversal.png">
</p>

# Nest-Nguniversal

> A Nx plugin to integrate NestJS server with a server side rendered Angular application.

Conceptually a NestJS server serves an Angular Universal application.<br>
Besides serving the application NestJS functionality can be used as usual.
The server uses the AngularUniversalModule provided by [`@nxarch/ng-universal`](https://github.com/nxarch/ng-universal)

<p>

[![@nxarch/nxarch](https://github.com/nxarch/nxarch/actions/workflows/ci.yml/badge.svg)](https://github.com/nxarch/nxarch/actions/workflows/ci.yml)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

</p>

## Prerequisites

You need a NestJS application and a Angular application in the same workspace.

## Installation

```
npm i @nxarch/nest-nguniversal
yarn add @nxarch/nest-nguniversal
```

### Setup

Use the provided generator to setup all files.
If you don't have an Angular and a NestJS app refer to [this](#setup-nx-apps-if-not-already-setup) part on how to
generate these
applications.

```
yarn nx generate @nxarch/ng-nest:init --ssrApp=my-angular-project --serverApp=my-nestjs-project
```

### App Start

Use the added target in the server configuration file.

```
yarn nx run my-nestjs-project:serve-ssr
```

### Setup Nx apps (if not already setup)

Setup an Angular app and a NestJS app

```
yarn add --dev @nrwl/angular @nrwl/nest
yarn nx generate @nrwl/angular:app
yarn nx generate @nrwl/nest:app
```

### Configuration

For configuring the AngularUniversalModule refer to [`@nxarch/ng-universal`](https://github.com/nxarch/ng-universal)
.

#### Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

#### License

MIT © 2022 nxarch
