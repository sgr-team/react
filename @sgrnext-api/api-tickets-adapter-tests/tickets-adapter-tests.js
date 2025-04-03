#!/usr/bin/env node
import path from 'path';
import { execSync } from 'child_process';

const cwd = process.cwd();
const __dirname = `/${path.dirname(import.meta.url.split('///')[1])}`;

try {
  execSync(
    `cd ${__dirname} && ADAPTER_PATH=${cwd} npx jest ${process.argv.slice(2).join(' ')}`, 
    { stdio: 'inherit' }
  );
} catch (error) {
} finally {
  execSync(`cd ${cwd}`, { stdio: 'inherit' });
}