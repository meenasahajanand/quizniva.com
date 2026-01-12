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
    } else if (/\.html?$/.test(file)) {
      results.push(file);
    }
  });
  return results;
}

function decodeUrlComponentSafe(s) {
  try { return decodeURIComponent(s); } catch(e) { return s; }
}

const root = path.resolve(__dirname, '..');
const files = walk(root);
console.log('Found', files.length, 'html files');

files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;

  // Remove Next runtime script tags
  src = src.replace(/\n?\s*<script[^>]*_next\/static[^>]*><\/script>/g, '');
  src = src.replace(/<script[^>]*_next\/static[^>]*><\/script>\n?/g, '');

  // Replace occurrences of /_next/image?url=ENCODEDURL... in srcSet and src
  // pattern: /_next/image?url=ENCODEDURL&amp;w=... or &w=...
  src = src.replace(/\/_next\/image\?url=([^"'&<> ]+)(?:&[^"'>\s]+)?/g, (m, enc) => {
    const decoded = decodeUrlComponentSafe(enc.replace(/&amp;/g, '&'));
    return decoded;
  });

  // Replace src attributes that include ?url=<encoded>
  src = src.replace(/src=("|')(?:[^"']*\?url=([^"']+))([^"']*)("|')/g, (m, q1, enc, tail, q2) => {
    const decoded = decodeUrlComponentSafe(enc);
    return 'src=' + q1 + decoded + q2;
  });

  // Replace srcSet attributes that include /_next/image?url=encoded
  src = src.replace(/srcSet=("|')([^"']*)("|')/g, (m, q1, val, q2) => {
    const newVal = val.replace(/\/_next\/image\?url=([^\s,]+)(?:&[^,\s]+)?/g, (all, enc) => {
      return decodeUrlComponentSafe(enc);
    });
    return 'srcSet=' + q1 + newVal + q2;
  });

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Patched', path.relative(root, file));
  }
});
console.log('Done');
