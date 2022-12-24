import { Logger } from '@nestjs/common';
import * as express from 'express';
import { Request } from 'express';
import { readdir } from 'fs';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { CacheKeyByOriginalUrlGenerator } from '../cache/cache-key-by-original-url.generator';
import { AngularUniversalOptions, MainSsr } from '../interfaces/angular-universal-options.interface';
import { CacheStorage } from '../interfaces/cache-storage.interface';
import { isNil } from './utilities';

const DEFAULT_CACHE_EXPIRATION_TIME = 60000; // 60 seconds

declare let __non_webpack_require__: any;

export async function setupUniversal(app: any, ngOptions: AngularUniversalOptions, ngStorageProvider: CacheStorage) {
  const logger = new Logger('AngularUniversalModule');
  const cacheOptions = getCacheOptions(ngOptions);

  app.engine(
    'html',
    async (_: string, options: { req: Request }, callback: (err: Error | null | undefined, html?: string) => void) => {
      let cacheKey: string;
      if (cacheOptions.isEnabled) {
        const cacheKeyGenerator = cacheOptions.keyGenerator;
        cacheKey = cacheKeyGenerator!.generateCacheKey(options.req);
        const cacheHtml = await ngStorageProvider.get(cacheKey, options.req);
        if (cacheHtml) {
          callback(null, cacheHtml);
          return;
        }
      }

      let mainSsr: MainSsr;
      if (typeof ngOptions.bootstrap === 'string') {
        if (typeof __non_webpack_require__ !== 'function')
          throw Error('Make sure to use webpack in order to use string type bootstrap property');

        // remove webpack require cache in order to ensure reload of app ssr bundle
        // will decrease server side rendering; only use during development!
        const shouldRemoveCache = !isNil(process.env.REMOVE_WEBPACK_CACHE)
          ? process.env.REMOVE_WEBPACK_CACHE === 'true'
          : process.env.NODE_ENV === 'development';

        if (shouldRemoveCache) {
          removeUiBundlesFromCache(ngOptions.bootstrap);
        }

        mainSsr = __non_webpack_require__(ngOptions.bootstrap);
      } else {
        mainSsr = await ngOptions.bootstrap();
      }

      const { AppSsrModule, ngExpressEngine } = mainSsr;

      ngExpressEngine({
        bootstrap: AppSsrModule || ngOptions.bootstrap,
        inlineCriticalCss: ngOptions.inlineCriticalCss,
        providers: [
          {
            provide: 'serverUrl',
            useValue: `${options.req.protocol}://${options.req.get('host')}`,
          },
          ...(ngOptions.extraProviders || []),
        ],
      })(_, options, (err, html) => {
        if (err && ngOptions.errorHandler) {
          return ngOptions.errorHandler({ err, html, renderCallback: callback });
        }

        if (err || !html) {
          logger.error(err);
          return callback(err);
        }

        if (cacheOptions.isEnabled && cacheKey) {
          html = ngStorageProvider.set(cacheKey, html, options.req, cacheOptions.expiresIn!) || html;
        }
        callback(null, html);
      });
    }
  );

  app.set('view engine', 'html');
  app.set('views', ngOptions.viewsPath);

  // Serve static files
  app.get(
    ngOptions.rootStaticPath,
    express.static(ngOptions.viewsPath, {
      maxAge: 600,
      setHeaders: ngOptions.staticAssetsHeaders,
    })
  );
}

export function getCacheOptions(ngOptions: AngularUniversalOptions) {
  if (!ngOptions.cache) {
    return {
      isEnabled: false,
    };
  }
  if (typeof ngOptions.cache !== 'object') {
    return {
      isEnabled: true,
      expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
      keyGenerator: new CacheKeyByOriginalUrlGenerator(),
    };
  }
  return {
    isEnabled: true,
    expiresIn: ngOptions.cache.expiresIn || DEFAULT_CACHE_EXPIRATION_TIME,
    keyGenerator: ngOptions.cache.keyGenerator || new CacheKeyByOriginalUrlGenerator(),
  };
}

function removeUiBundlesFromCache(mainJsPath: string) {
  const uiFolder = mainJsPath.slice(0, mainJsPath.lastIndexOf('/'));

  readdir(uiFolder, (err: Error | null, files: string[]) => {
    // Variable `files` can sometimes be undefined (probably no UI bundles cached) and crash the server
    if (files !== undefined) {
      files.forEach((file) => {
        const absolutePath = uiFolder + '/' + file;

        if (file.includes('.js') && !!__non_webpack_require__.cache[absolutePath]) {
          delete __non_webpack_require__.cache[absolutePath];
        }
      });
    }
  });
}
