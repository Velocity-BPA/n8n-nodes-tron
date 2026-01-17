/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

const esbuild = require('esbuild');
const fs = require('fs');

// Ensure directories exist
fs.mkdirSync('dist/nodes/Tron', { recursive: true });
fs.mkdirSync('dist/credentials', { recursive: true });

// Bundle the Tron node with TronWeb embedded
esbuild.buildSync({
  entryPoints: ['nodes/Tron/Tron.node.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/nodes/Tron/Tron.node.js',
  external: ['n8n-workflow'],
  sourcemap: true,
});

// Bundle credentials
esbuild.buildSync({
  entryPoints: ['credentials/TronApi.credentials.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/credentials/TronApi.credentials.js',
  external: ['n8n-workflow'],
  sourcemap: true,
});

// Bundle index
esbuild.buildSync({
  entryPoints: ['index.ts'],
  bundle: false,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  sourcemap: true,
});

// Copy SVG icon
fs.copyFileSync('nodes/Tron/tron.svg', 'dist/nodes/Tron/tron.svg');

console.log('Build complete!');
