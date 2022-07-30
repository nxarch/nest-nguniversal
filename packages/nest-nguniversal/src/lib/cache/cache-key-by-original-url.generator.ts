import { Request } from 'express';
import { CacheKeyGenerator } from '../interfaces/cache-key-generator.interface';

export class CacheKeyByOriginalUrlGenerator implements CacheKeyGenerator {
  generateCacheKey(request: Request): string {
    return request.originalUrl;
  }
}
