import { Inject, Injectable } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IS_SERVER } from './platform.tokens';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  /**
   * local store for all created keys
   * @private
   */
  private keys = new Map<string, StateKey<string>>();

  constructor(@Inject(IS_SERVER) private readonly isServer: any, private readonly transferState: TransferState) {}

  get state() {
    return this.transferState['store'];
  }

  /**
   * on fetch try to get value from store;
   * if value for certain key isn't present fetch the value from the api and store the value in the transfer state
   * @param key
   * @param runOrGetFromTS$
   */
  fetch<T>(key: string, runOrGetFromTS$: () => Observable<T>): Observable<T | null> {
    if (this.has(key)) {
      return of(this.get<T>(key)).pipe(
        tap(() => {
          if (!this.isServer) this.remove(key);
        })
      );
    }

    return runOrGetFromTS$().pipe(tap((value) => this.set(key, value)));
  }

  get<T>(key: string): T | null {
    return this.transferState.get<T | null>(this.getStateKey(key), null);
  }

  has(key: string): boolean {
    return this.transferState.hasKey(this.getStateKey(key));
  }

  remove(key: string): void {
    if (!this.has(key)) return;
    this.transferState.remove(this.getStateKey(key));
  }

  set<T>(key: string, value: T): void {
    if (this.isServer) this.transferState.set<T>(this.getStateKey(key), value);
  }

  /**
   * Gets/creates key if it doesn't exist
   */
  private getStateKey(key: string): StateKey<any> {
    if (this.keys.has(key)) return this.keys.get(key)!;

    return this.createKey(key)!;
  }

  private createKey(key: string) {
    this.keys.set(key, makeStateKey(key));

    return this.keys.get(key);
  }
}
