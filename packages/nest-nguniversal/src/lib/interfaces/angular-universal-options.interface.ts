import { Type } from '@nestjs/common';
import { ServerResponse } from 'http';
import { AngularUniversalStorageProvider, CacheKeyGenerator } from './cache-key-generator.interface';

export interface CacheOptions {
  expiresIn?: number;
  storage?: AngularUniversalStorageProvider;
  keyGenerator?: CacheKeyGenerator;
}

export interface MainSsr {
  AppSsrModule: Type;
  ngExpressEngine: (
    setupOptions: any
  ) => (filePath: string, options: Record<any, any>, callback: (err?: Error | null, html?: string) => void) => void;
}

export interface AngularUniversalOptions {
  /**
   * The directory where the module should look for client bundle (Angular app).
   */
  viewsPath: string;
  /**
   * Path to index file.
   * Default: {viewsPaths}/index.html
   */
  templatePath?: string;
  /**
   * Static files root directory.
   * Default: *.*
   */
  rootStaticPath?: string | RegExp;
  /**
   * Path to render Angular app.
   * Default: * (wildcard - all paths)
   */
  renderPath?: string;
  /**
   * The platform level providers for the current render request.
   */
  extraProviders?: any[];
  /**
   * Reduce render blocking requests by inlining critical CSS.
   * Default: true.
   */
  inlineCriticalCss?: boolean;
  /**
   * Cache options (flag or configuration object)
   */
  cache?: boolean | CacheOptions;
  /**
   * Callback to be called in case of a rendering error.
   */
  errorHandler?: (params: { err?: Error; html?: string; renderCallback: (err: any, content: string) => void }) => void;
  /**
   * Module to bootstrap
   */
  bootstrap: string | (() => Promise<MainSsr>);
  /**
   * Use a custom endpoint for Angular rendering
   */
  useCustomRenderEndpoint?: boolean;
  /**
   * Set custom headers to static assets responses
   * @param res
   * @param path
   * @param stat
   */
  staticAssetsHeaders?: (res: ServerResponse, path: string, stat: any) => any;
}
