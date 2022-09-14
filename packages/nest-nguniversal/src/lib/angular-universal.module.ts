import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { ANGULAR_UNIVERSAL_CACHE, ANGULAR_UNIVERSAL_OPTIONS } from './angular-universal.constants';
import { angularUniversalProviders } from './angular-universal.providers';
import { InMemoryCacheStorage } from './cache/in-memory-cache.storage';
import { AngularUniversalOptions, CacheOptions } from './interfaces/angular-universal-options.interface';
import { setupBsReloadWatcher } from './utils/setup-bs-reload-watcher';

@Module({
  providers: [...angularUniversalProviders],
})
export class AngularUniversalModule implements OnModuleInit {
  constructor(
    @Inject(ANGULAR_UNIVERSAL_OPTIONS)
    private readonly ngOptions: AngularUniversalOptions,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  static forRoot(options: AngularUniversalOptions): DynamicModule {
    const indexHtml = existsSync(join(options.viewsPath, 'index.original.html')) ? 'index.original.html' : 'index';

    if (process.env.NXARCH_SERVER_AUTO_SYNC === 'true') setupBsReloadWatcher();

    options = {
      templatePath: indexHtml,
      rootStaticPath: '*.*',
      renderPath: '*',
      ...options,
    };

    return {
      module: AngularUniversalModule,
      providers: [
        {
          provide: ANGULAR_UNIVERSAL_OPTIONS,
          useValue: options,
        },
        {
          provide: ANGULAR_UNIVERSAL_CACHE,
          ...((options?.cache as CacheOptions)?.storage || { useValue: new InMemoryCacheStorage() }),
        },
      ],
    };
  }

  async onModuleInit() {
    if (this.ngOptions.useCustomRenderEndpoint) return;
    if (!this.httpAdapterHost) {
      return;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (!httpAdapter) {
      return;
    }
    const app = httpAdapter.getInstance();
    app.get(this.ngOptions.renderPath, (req: Request, res: Response) => {
      res.render(this.ngOptions.templatePath!, {
        req,
        res,
      });
    });
  }
}
