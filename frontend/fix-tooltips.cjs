const fs = require('fs');
const file = 'C:\\\\Users\\\\bkala\\\\.gemini\\\\antigravity\\\\scratch\\\\axiom\\\\frontend\\\\src\\\\pages\\\\AxiomApp.tsx';
let data = fs.readFileSync(file, 'utf8');

// replace <Tooltip ...> with <Tooltip separator=" " ...>
data = data.replace(/<Tooltip(?!.*separator=)((?:(?!>).)*)/g, (match, p1) => {
    return `<Tooltip separator=" "${p1}`;
});

// fix formatters
data = data.replace(/v\.toFixed\(2\)/g, "Number(v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})");
data = data.replace(/Number\(v\)\.toFixed\(1\)/g, "Number(v).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})");
data = data.replace(/Number\(v\)\.toFixed\(2\)/g, "Number(v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})");
data = data.replace(/Math\.abs\(v\)\.toFixed\(2\)/g, "Number(Math.abs(v)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})");

fs.writeFileSync(file, data);
console.log('Done modifying tooltips in AxiomApp.tsx');
