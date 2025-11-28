#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find the consuming project's root (go up from node_modules)
const packageDir = __dirname.replace(/scripts$/, '');
const nodeModulesDir = path.dirname(path.dirname(packageDir));
const projectRoot = path.dirname(nodeModulesDir);

// Source and destination paths
const sourceDir = path.join(packageDir, 'website');
const destDir = path.join(projectRoot, 'website');

// Only copy if we're being installed as a dependency (not during development)
if (!nodeModulesDir.endsWith('node_modules')) {
  console.log('Skipping postinstall: not installed as a dependency');
  process.exit(0);
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDir(sourceDir, destDir);
  console.log(`Copied website folder to ${destDir}`);
} catch (err) {
  console.error('Failed to copy website folder:', err.message);
}
