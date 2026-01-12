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
console.log('Fixing layout in', files.length, 'html files');

files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;
  
  // Determine correct src path based on file location
  let logoSrc = '/_next/lightingporta051.png';
  if (file.includes('news/') && !file.includes('news1/')) {
    logoSrc = '../_next/lightingporta051.png';
  } else if (file.includes('category/') || file.includes('about/')) {
    logoSrc = '../_next/lightingporta051.png';
  } else if (file.includes('category11/')) {
    logoSrc = '../_next/lightingporta051.png';
  }

  // Fix broken img tags - add proper display and sizing
  src = src.replace(
    /<img alt="lightingport" width="150" height="80" style="[^"]*" src="[^"]*" \/>/g,
    `<img alt="lightingport" width="150" height="80" style="max-width:150px;height:auto;object-fit:contain;" src="${logoSrc}" />`
  );

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Fixed logo in', path.relative(root, file));
  }
});
console.log('Done');
