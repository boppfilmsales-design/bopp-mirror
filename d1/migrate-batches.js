// migrate-batches.js - 批量执行 D1 迁移
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SQL_DIR = path.resolve(__dirname, 'sql_batches');
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!TOKEN) {
    console.error('❌ 请设置 CLOUDFLARE_API_TOKEN 环境变量');
    process.exit(1);
}

const sqlFiles = fs.readdirSync(SQL_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

console.log(`📦 找到 ${sqlFiles.length} 个 SQL 批次文件`);

let success = 0;
let failed = 0;

for (const file of sqlFiles) {
    const filePath = path.join(SQL_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
        const cmd = `npx wrangler d1 execute bopp-mirror --remote --command="${sql.replace(/"/g, '\\"')}"`;
        execSync(cmd, {
            env: { ...process.env, CLOUDFLARE_API_TOKEN: TOKEN },
            stdio: 'pipe',
            timeout: 30000
        });
        success++;
        console.log(`✅ ${file}`);
    } catch (e) {
        failed++;
        console.error(`❌ ${file}: ${e.message.substring(0, 100)}`);
    }
}

console.log(`\n📊 完成: ${success} 成功, ${failed} 失败`);
