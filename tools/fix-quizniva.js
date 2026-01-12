const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (/\.html?$/.test(file) && !file.includes('.history')) {
      results.push(file);
    }
  });
  return results;
}

const root = path.resolve(__dirname, '..');
const files = walk(root);
console.log('Fixing', files.length, 'html files');

files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;

  // Remove quizniva scripts and styles completely
  src = src.replace(/<script>[\s\S]*?forceQuiznivaLogo[\s\S]*?<\/script>/g, '<!-- Removed quizniva forcing script -->');
  src = src.replace(/<style>[\s\S]*?Force quizniva[\s\S]*?<\/style>/g, '<!-- Removed quizniva forcing styles -->');

  // Fix header logo - replace quizniva references with lightingport img
  // Pattern 1: aria-label="quizniva.com" with img tag
  src = src.replace(
    /<a aria-label="quizniva\.com"[\s\S]*?<img alt="quizniva\.com"[^>]*src="[^"]*"[^>]*\/><\/span><\/a>/g,
    '<a aria-label="lightingport" class="retain-query-link" href="' + 
    (file.includes('index.html') ? 'index.html' : (file.includes('category') || file.includes('news') ? '../index.html' : '../../../index.html')) + 
    '"><span class="flex-none text-xl font-semibold text-undefined"><img alt="lightingport" width="150" height="80" style="object-fit:contain;max-width:150px;height:auto;" src="' +
    (file.includes('category') || file.includes('about') ? '../' : '') + 
    '_next/lightingporta051.png" /></span></a>'
  );

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Patched', path.relative(root, file));
  }
});
console.log('Done');
