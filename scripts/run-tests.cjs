const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const distDir = path.join(process.cwd(), '.test-dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

execSync('node ./node_modules/typescript/bin/tsc -p tsconfig.test.json', {
  stdio: 'inherit',
});

const tests = [
  '.test-dist/tests/khatma-domain.test.js',
  '\.test-dist/tests/draft-store.test.js',
  '.test-dist/tests/cloud-khatma-mutations.test.js',
];

for (const testFile of tests) {
  require(path.join(process.cwd(), testFile));
  console.log(`PASS ${testFile}`);
}

