import { triggerReload } from './trigger-reload';

export function setupBsReloadWatcher() {
  let isBlocked = false;
  let timer: any;

  (process.stdout as any)._orig_write = process.stdout.write;

  const reloadWatcher: any = (data: any) => {
    if (timer) clearTimeout(timer);

    if (!isBlocked) {
      timer = setTimeout(() => {
        isBlocked = true;
        triggerReload();
      }, 50);
    }

    (process.stdout as any)._orig_write(data);
  };

  process.stdout.write = reloadWatcher;
}
