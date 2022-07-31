import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const IS_SERVER = new InjectionToken<boolean>('[NEST-NGUNIVERSAL] Check for server platform', {
  factory() {
    const platformId = inject(PLATFORM_ID);

    return isPlatformServer(platformId);
  },
});

export const IS_BROWSER = new InjectionToken<boolean>('[NEST-NGUNIVERSAL] Check for browser platform', {
  factory() {
    const platformId = inject(PLATFORM_ID);

    return isPlatformBrowser(platformId);
  },
});
