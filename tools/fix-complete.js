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
    if (!file.endsWith('.html') || file.includes('.history')) return;

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
    
    // Fix logo img tag - replace any variant with clean version
    content = content.replace(
        /<img[^>]*alt="lightingport"[^>]*>/g,
        `<img alt="lightingport" width="150" height="80" style="max-width:150px;height:auto;object-fit:contain;" src="${logoPath}" />`
    );
    
    // Also fix if aria-label says "quizniva.com" (old code)
    content = content.replace(
        /<img[^>]*alt="Image Description"[^>]*>/g,
        (match) => {
            // Extract class and other attributes we want to preserve
            const classMatch = match.match(/class="([^"]*)"/);
            const widthMatch = match.match(/width="(\d+)"/);
            const heightMatch = match.match(/height="(\d+)"/);
            const altMatch = match.match(/alt="([^"]*)"/);
            
            const cls = classMatch ? classMatch[1] : 'w-full object-cover rounded-xl';
            const width = widthMatch ? widthMatch[1] : '1458';
            const height = heightMatch ? heightMatch[1] : '962';
            const alt = altMatch ? altMatch[1] : 'Image Description';
            
            // Extract src URL if it's a local file
            const srcMatch = match.match(/src="([^"]*)"/);
            let imageSrc = '';
            if (srcMatch) {
                const src = srcMatch[1];
                // Get just the filename from local paths
                if (src.startsWith('../_next/')) {
                    imageSrc = src.split('?')[0]; // Remove query params
                } else if (src.includes('cdn') || src.includes('storage.googleapis')) {
                    imageSrc = src.split('?')[0];
                } else {
                    imageSrc = src;
                }
            }
            
            return `<img alt="${alt}" width="${width}" height="${height}" class="${cls}" style="color:transparent" src="${imageSrc}" />`;
        }
    );
    
    // Remove data-nimg attributes
    content = content.replace(/\s*data-nimg="[^"]*"/g, '');
    
    // Remove decoding attributes
    content = content.replace(/\s*decoding="[^"]*"/g, '');
    
    // Remove srcSet attributes that contain _next/image
    content = content.replace(/\s*srcSet="[^"]*_next\/image[^"]*"/g, '');
    
    // Remove style="color:transparent" from non-image tags
    content = content.replace(/(<img[^>]*?)style="color:transparent"\s*/g, '$1');
    
    if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        fixed++;
        console.log(`Fixed ${path.relative(baseDir, file)}`);
    }
});

console.log(`\nTotal files fixed: ${fixed}`);
