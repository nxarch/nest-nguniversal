<p align="center">
 <img width="75%" height="75%" src="nest-nguniversal.png">
</p>

# Nest-Nguniversal

> A module that will integrate your Angular SSR app into your NestJS app.

<p>

[![@nxarch/nest-nguniversal](https://github.com/nxarch/nest-nguniversal/actions/workflows/ci.yml/badge.svg)](https://github.com/nxarch/nest-nguniversal/actions/workflows/ci.yml)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

</p>

Kudos to @kamilmysliwiec as this library is an extension
of [@nestjs/ng-universal](https://github.com/nestjs/ng-universal).

## Prerequisites

This library requires seperated ui-app, ssr-app and server-app bundles.
Separating compilation enhances DX and reflects that server and ui application handled differently.

This is one possible setup

```
├── dist                  
│   ├── server              
│   |   ├── main.js             
│   ├── ssr-app  
│   |   ├── main.js 
│   ├── ui-app 
│   |   ├── main.js              
│   |   ├── index.html
...
```

In order to immensely simplify the process use [@nxarch/nxarch](https://github.com/nxarch/nxarch). This library
will set up everything with on simple command.

## Installation

```
npm i @nxarch/nest-nguniversal
yarn add @nxarch/nest-nguniversal
```

### Usage

```ts
AngularUniversalModule.forRoot({
  bootstrap: join(process.cwd(), 'dist/ssr-app/main.js'),
  viewsPath: join(process.cwd(), 'dist/ui-app/browser')
})
```

## API Spec

The `forRoot()` method takes an options object with a few useful properties.

| Property                  | Type                    | Description                                                                |
|---------------------------|-------------------------|----------------------------------------------------------------------------|
| `viewsPath`               | string                  | The directory where the module should look for client bundle (Angular app) |
| `bootstrap`               | string                  | Compiled Angular server module path (Angular SSR app)                      |
| `useCustomRenderEndpoint` | boolean                 | Use this option to specify your own endpoint to render your Angular app    |
| `templatePath`            | string?                 | Path to index file (default: `{viewsPaths}/index.html`)                    |
| `rootStaticPath`          | string?                 | Static files root directory (default: `*.*`)                               |
| `renderPath`              | string?                 | Path to render Angular app (default: `*`)                                  |
| `extraProviders`          | StaticProvider[]?       | The platform level providers for the current render request                |
| `inlineCriticalCss`       | boolean?                | Reduce render blocking requests by inlining critical CSS. (default: true)  |
| `cache`                   | boolean? \ CacheOptions | Cache options, description below (default: `true`; uses InMemoryCache)     |
| `errorHandler`            | Function?               | Callback to be called in case of a rendering error                         |

### Cache

| Property       | Type               | Description                                                                    |
| -------------- | ------------------ | ------------------------------------------------------------------------------ |
| `expiresIn`    | number?            | Cache expiration in milliseconds (default: `60000`)                            |
| `storage`      | CacheStorage?      | Interface for implementing custom cache storage (default: in memory)           |
| `keyGenerator` | CacheKeyGenerator? | Interface for implementing custom cache key generation logic (default: by url) |

```ts
AngularUniversalModule.forRoot({
  bootstrap: join(process.cwd(), 'dist/ssr-app/main.js'),
  viewsPath: join(process.cwd(), 'dist/ui-app/browser'),
  cache: {
    storage: {
      useClass: RedisCacheStorage
    }
    // storage: {
    //   useValue: new InMemoryCacheStorage(),
    // },
    // expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
    // keyGenerator: new CustomCacheKeyGenerator()
  }
});
```

```ts
import { CacheStorage } from '@nxarch/nest-nguniversal';

@Injectable()
export class RedisCacheStorage implements CacheStorage {

  constructor(private redisCacheService: RedisCacheService) {}

  async get(key: string, request: Request): Promise<string | undefined> {
    const result = await this.redisCacheService.get(key);
    return result;
  }

  set(key: string, html: string, request: Request) {
    this.redisCacheService.set(key, html);
    return html;
  }
}
```

### Example for CacheKeyGenerator:

```typescript
export class CustomCacheKeyGenerator implements CacheKeyGenerator {
  generateCacheKey(request: Request): string {
    const md       = new MobileDetect(request.headers['user-agent']);
    const isMobile = md.mobile() ? 'mobile' : 'desktop';
    return (request.hostname + request.originalUrl + isMobile).toLowerCase();
  }
}
```

## Request and Response Providers

This tool uses `@nguniversal/express-engine` and will properly provide access to the Express Request and Response
objects in you Angular components. Note that tokens must be imported from the `@nestjs/ng-universal/tokens`,
not `@nguniversal/express-engine/tokens`.

This is useful for things like setting the response code to 404 when your Angular router can't find a page (
i.e. `path: '**'` in routing):

```ts
import { Response }                                 from 'express';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer }                         from '@angular/common';
import { RESPONSE }                                 from '@nestjs/ng-universal/tokens';

@Component({
  selector: 'my-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: any,
    @Optional()
    @Inject(RESPONSE)
      res: Response
  ) {
    // `res` is the express response, only available on the server
    if (isPlatformServer(this.platformId)) {
      res.status(404);
    }
  }
}
```

#### Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

#### License

[MIT](LICENSE) © 2022 nxarch
