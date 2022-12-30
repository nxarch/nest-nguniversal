import { readFile, writeFile } from './node.utils';

export function triggerReload() {
  const syncPath = process.env.BS_TRIGGER_FILE;
  if (!syncPath) return;

  const content = readFile(syncPath);
  writeFile(syncPath, !content);
}
