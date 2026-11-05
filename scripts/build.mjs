import { mkdir, copyFile, cp, access, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyFile(new URL('index.html', root), new URL('index.html', output));
for (const directory of ['assets/', 'games/']) {
  try {
    await access(new URL(directory, root));
    await cp(new URL(directory, root), new URL(directory, output), { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
console.log(`Built ${fileURLToPath(output)}`);
