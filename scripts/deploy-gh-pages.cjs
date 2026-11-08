const { execSync } = require('child_process');
const path = require('path');
const distDir = path.resolve(__dirname, '../dist');

console.log('Deploying dist to gh-pages...');
execSync('git init', { cwd: distDir, stdio: 'inherit' });
execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
try {
  execSync('git commit -m "deploy: update gh-pages"', { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f https://github.com/18033933660zjn-ship-it/pomodoro-csu.git gh-pages', { cwd: distDir, stdio: 'inherit' });
  console.log('Successfully deployed dist to GitHub Pages!');
} catch (e) {
  console.log('No new changes to deploy or already up to date.');
}
