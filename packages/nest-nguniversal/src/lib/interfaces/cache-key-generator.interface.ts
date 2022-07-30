import { Abstract, Scope, Type } from '@nestjs/common';
import { CacheStorage } from './cache-storage.interface';

export interface CacheKeyGenerator {
  generateCacheKey(request: any): string;
}

export declare type AngularUniversalStorageProvider =
  | FixedTokenClassProvider<CacheStorage>
  | FixedTokenValueProvider<CacheStorage>
  | FixedTokenFactoryProvider<CacheStorage>
  | FixedTokenExistingProvider<CacheStorage>;

export interface FixedTokenClassProvider<T = any> {
  useClass: Type<T>;
  scope?: Scope;
}

export interface FixedTokenValueProvider<T = any> {
  useValue: T;
}

export interface FixedTokenFactoryProvider<T = any> {
  useFactory: (...args: any[]) => T;
  inject?: Array<Type<any> | string | symbol | Abstract<any> | ((...args: any) => any)>;
  scope?: Scope;
}

export interface FixedTokenExistingProvider<T = any> {
  useExisting: any;
}
