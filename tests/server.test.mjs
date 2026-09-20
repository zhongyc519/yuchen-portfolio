import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('preview serves files and blocks missing files and directory traversal', async () => {
  const { createPreviewServer } = await import('../server.mjs');
  const root = await mkdtemp(join(tmpdir(), 'portfolio-test-'));
  await writeFile(join(root, 'index.html'), '<h1>Portfolio</h1>');
  const server = createPreviewServer(root);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(base + '/?lang=zh');
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(await response.text(), '<h1>Portfolio</h1>');
    assert.equal((await fetch(base + '/missing.css')).status, 404);
    assert.equal((await fetch(base + '/..%2fsecret.txt')).status, 403);
    assert.equal((await fetch(base + '/%broken')).status, 400);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});
