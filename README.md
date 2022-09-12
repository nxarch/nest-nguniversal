<p align="center">
 <img width="75%" height="75%" src="https://raw.githubusercontent.com/nxarch/nest-nguniversal/master/assets/nest-nguniversal.png">
</p>

# Nest-Nguniversal

> A module that will integrate your Angular SSR app and your NestJS app.

This module takes care of incorporating the Angular Universal application and forwarding requests to their desired
destination.
Angular Universal will render the requested view which will then be served by the NestJS server.

<p align="center">
<a href="https://github.com/nxarch/nest-nguniversal/actions/workflows/ci.yml">
  <img src="https://github.com/nxarch/nest-nguniversal/actions/workflows/ci.yml/badge.svg" />
</a>&nbsp;

<a href="https://www.npmjs.com/@nxarch/nest-nguniversal">
  <img src="https://img.shields.io/npm/v/@nxarch/nest-nguniversal.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="NxArch on npm" />
</a>&nbsp;

<a href="https://github.com/nxarch/nest-nguniversal/CONTRIBUTING.md">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
</a>&nbsp;

<a href="https://github.com/semantic-release/semantic-release">
  <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg" />
</a>&nbsp;

<a href="https://discord.gg/G7Qnnhy" target="_blank">
  <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord NestJS" />
</a>&nbsp;

<a href="https://discord.gg/angular">
  <img src="https://img.shields.io/discord/463752820026376202.svg?logo=discord&logoColor=fff&label=Discord&color=7389d8" alt="Discord conversation" />
</a>
</p>

Kudos to the maintainers/contributors of [@nestjs/ng-universal](https://github.com/nestjs/ng-universal) as this library
is built on
top of this repository.

## Prerequisites

This library requires separate ui, ssr and server bundles.
Separating compilation enhances DX and reflects that server and ui applications handled differently.

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

**&rarr; In order to immensely simplify the setup process use [@nxarch/ng-nest](https://github.com/nxarch/nxarch/tree/master/packages/ng-nest).
This library will set up everything with one simple command.**

## Installation

```
npm i @nxarch/nest-nguniversal
yarn add @nxarch/nest-nguniversal
```

## Usage

```ts
AngularUniversalModule.forRoot({
  bootstrap: join(process.cwd(), 'dist/ssr-app/main.js'),
  viewsPath: join(process.cwd(), 'dist/ui-app/browser'),
});
```

## API Spec

The `forRoot()` method takes an options object with a few useful properties.

| Property                  | Type                    | Description                                                                |
| ------------------------- | ----------------------- | -------------------------------------------------------------------------- |
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

### Routes

Make sure to prefix your api route to avoid Angular and NestJS route collisions.
The `renderPath` will be set up after all api routes are registered.
If you choose to use the default render path (\*) all requests to routes that aren't specified inside your API
controllers
will be funneled to Angular Universals ngExpressEngine to render the Angular view.

```ts
// main.ts - e.g. use this
async function bootstrap() {
  // ...
  app.setGlobalPrefix('api');
}
```

### Custom Render Endpoint

If you chose to use your own implementation for the route where the Angular app is going to be rendered and returned
make sure to implement a Controller accordingly.<br>
Also Make sure to include the RenderController in your module.

```ts
export class RenderController {
  @Get('*')
  render(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    res.render(this.viewsPath + '/index.html', { req, res });
  }
}
```

### Cache

| Property       | Type               | Description                                                                    |
| -------------- | ------------------ | ------------------------------------------------------------------------------ |
| `expiresIn`    | number?            | Cache expiration in milliseconds (default: `60000`)                            |
| `storage`      | CacheStorage?      | Interface for implementing custom cache storage (default: in memory)           |
| `keyGenerator` | CacheKeyGenerator? | Interface for implementing custom cache key generation logic (default: by url) |

```ts
AngularUniversalModule.forRoot({
  // ...
  cache: {
    storage: {
      useClass: RedisCacheStorage,
    },
    // or
    // storage: {
    //   useValue: new InMemoryCacheStorage(),
    // },
    // expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
    // keyGenerator: new CustomCacheKeyGenerator()
  },
});
```

### Example for RedisCacheStorage:

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
    const md = new MobileDetect(request.headers['user-agent']);
    const isMobile = md.mobile() ? 'mobile' : 'desktop';
    return (request.hostname + request.originalUrl + isMobile).toLowerCase();
  }
}
```

### Request and Response Providers

This tool uses `@nguniversal/express-engine` and will properly provide access to the Express Request and Response
objects in you Angular components. Note that tokens must be imported from the `@nestjs/ng-universal/tokens`,
not `@nguniversal/express-engine/tokens`.

This is useful for things like setting the response code to 404 when your Angular router can't find a page (
i.e. `path: '**'` in routing):

```ts
import { isPlatformServer } from '@angular/common';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { RESPONSE } from '@nestjs/ng-universal/tokens';
import { Response } from 'express';

@Component({
  selector: 'my-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: any, @Optional() @Inject(RESPONSE) res: Response) {
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
