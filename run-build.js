const { execSync } = require('child_process');
const fs = require('fs');
const logPath = 'C:\\Users\\bkala\\.gemini\\antigravity\\scratch\\axiom\\build.log';

try {
    const out = execSync(
        '"C:\\Program Files\\nodejs\\npm.cmd" run build',
        {
            cwd: 'C:\\Users\\bkala\\.gemini\\antigravity\\scratch\\axiom\\frontend',
            encoding: 'utf8',
            timeout: 120000,
        }
    );
    fs.writeFileSync(logPath, 'SUCCESS\n' + out);
    process.stdout.write('BUILD OK\n');
    process.stdout.write(out.slice(-3000) + '\n');
} catch (e) {
    const log = 'FAILED\n' + (e.stdout || '') + '\n---STDERR---\n' + (e.stderr || '') + '\n---MSG---\n' + e.message;
    fs.writeFileSync(logPath, log);
    process.stdout.write('BUILD FAILED\n');
    process.stdout.write((e.stdout || '').slice(-2000) + '\n');
    process.stdout.write((e.stderr || '').slice(-2000) + '\n');
    process.stdout.write(e.message.slice(0, 500) + '\n');
}
