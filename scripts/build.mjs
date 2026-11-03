import { mkdir, copyFile, cp, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
await copyFile(new URL('index.html', root), new URL('index.html', output));
try {
  await access(new URL('assets/', root));
  await cp(new URL('assets/', root), new URL('assets/', output), { recursive: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log(`Built ${fileURLToPath(output)}`);
