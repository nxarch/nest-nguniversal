import { Request } from 'express';

export interface CacheStorage {
  set(key: string, value: string, request: Request, expiresIn: number): string | void;

  get(key: string, request: Request): Promise<string | null> | string | null;
}
