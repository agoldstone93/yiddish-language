import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const mode = process.argv[2] || process.env.DECAP_CONFIG || process.env.NODE_ENV || 'production';
const rootDir = process.cwd();

const adminDir = path.join(rootDir, 'public', 'admin');
const basePath = path.join(adminDir, 'config.base.yml');
const localOverridePath = path.join(adminDir, 'config.local.yml');
const outputPath = path.join(adminDir, 'config.yml');

const isLocal = mode === 'local' || mode === 'development' || mode === 'dev';

// Read the base config
const baseConfig = yaml.load(fs.readFileSync(basePath, 'utf8'));

// For local dev, merge with local override if it exists
if (isLocal && fs.existsSync(localOverridePath)) {
  const localOverride = yaml.load(fs.readFileSync(localOverridePath, 'utf8'));
  const merged = { ...baseConfig, ...localOverride };
  fs.writeFileSync(outputPath, yaml.dump(merged, { lineWidth: -1 }), 'utf8');
  console.log(`[decap] local mode (merged config.base.yml + config.local.yml → config.yml)`);
} else {
  // For prod or if no local override exists, just copy base config
  fs.copyFileSync(basePath, outputPath);
  console.log(`[decap] ${isLocal ? 'local' : 'production'} mode (copied config.base.yml → config.yml)`);
}


