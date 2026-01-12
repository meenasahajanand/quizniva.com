const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    });
}

let fixed = 0;
const baseDir = path.join(__dirname, '..');

walk(baseDir, (file) => {
    if (!file.endsWith('.html')) return;

    let content = fs.readFileSync(file, 'utf8');
    const origContent = content;
    
    // Get relative folder depth
    const relPath = path.relative(baseDir, file);
    const depth = relPath.split(path.sep).length - 1; // -1 because last element is filename
    
    // Build correct logo path based on depth
    let logoPath;
    if (depth === 0) {
        // Root level files (index.html)
        logoPath = '/_next/lightingporta051.png';
    } else {
        // Nested folders need ../ prefix for each level
        logoPath = '../'.repeat(depth) + '_next/lightingporta051.png';
    }
    
    // Fix the img tag with correct src
    // This handles both /_next/lightingporta051.png and ../_next/lightingporta051.png paths
    content = content.replace(
        /<img alt="lightingport" width="150" height="80" style="[^"]*" src="[^"]*" \/>/g,
        `<img alt="lightingport" width="150" height="80" style="max-width:150px;height:auto;object-fit:contain;" src="${logoPath}" />`
    );
    
    // Also handle variant without width/height
    content = content.replace(
        /<img alt="lightingport" style="[^"]*" src="[^"]*" \/>/g,
        `<img alt="lightingport" width="150" height="80" style="max-width:150px;height:auto;object-fit:contain;" src="${logoPath}" />`
    );
    
    if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        fixed++;
        console.log(`Fixed logo in ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nTotal files fixed: ${fixed}`);
