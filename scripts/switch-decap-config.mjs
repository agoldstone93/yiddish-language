import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] || process.env.DECAP_CONFIG || process.env.NODE_ENV || 'production';
const rootDir = process.cwd();

const adminDir = path.join(rootDir, 'public', 'admin');
const targetPath = path.join(adminDir, 'config.yml');
const prodPath = path.join(adminDir, 'config.prod.yml');
const localPath = path.join(adminDir, 'config.local.yml');

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const isLocal = mode === 'local' || mode === 'development' || mode === 'dev';

if (isLocal) {
  if (fs.existsSync(localPath)) {
    copyFile(localPath, targetPath);
    console.log('[decap] using local config (config.local.yml → config.yml)');
  } else {
    copyFile(prodPath, targetPath);
    console.warn('[decap] config.local.yml not found; using prod config (config.prod.yml → config.yml)');
    console.warn('[decap] to enable local_backend, copy config.local.example.yml → config.local.yml');
  }
} else {
  copyFile(prodPath, targetPath);
  console.log('[decap] using prod config (config.prod.yml → config.yml)');
}
