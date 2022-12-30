import * as fs from 'fs';

export function removeDir(path: string) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }
}

export function writeFile(path: string, content: string | number | Record<PropertyKey, unknown> | boolean) {
  try {
    content = JSON.stringify(content);
    return fs.writeFileSync(path, content);
  } catch (err) {
    // console.log(err);
  }
}

export function readFile(path: string) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    // console.log(err);
  }
}
