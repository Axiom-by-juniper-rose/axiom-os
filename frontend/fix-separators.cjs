const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}
const files = walk('C:\\\\Users\\\\bkala\\\\.gemini\\\\antigravity\\\\scratch\\\\axiom\\\\frontend\\\\src');
files.forEach(file => {
    let data = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (data.includes('separator: " "')) {
        data = data.replace(/separator:\s*" "/g, 'separator: ""');
        changed = true;
    }
    if (data.includes('separator=" "')) {
        data = data.replace(/separator=" "/g, 'separator=""');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, data);
        console.log('Fixed separators in', file);
    }
});
