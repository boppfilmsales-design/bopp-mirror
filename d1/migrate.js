// migrate.js - 从 seed_data.js 迁移数据到 D1
// 用法: node migrate.js [--dry-run]
//   --dry-run: 只打印 SQL，不实际执行

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 读取 seed_data.js 并提取 JSON
function extractSeedData() {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, 'admin/js/seed_data.js'), 'utf8');
    const seedPos = content.indexOf('var XGXCMS_SEED');
    const jsonStart = content.indexOf('{', seedPos);

    let braceDepth = 0;
    let inString = false;
    let escapeNext = false;

    let jsonEnd = jsonStart;
    for (let i = jsonStart; i < content.length; i++) {
        const ch = content[i];
        if (escapeNext) { escapeNext = false; continue; }
        if (ch === '\\' && inString) { escapeNext = true; continue; }
        if (ch === '"') { inString = !inString; }
        else if (!inString) {
            if (ch === '{') braceDepth++;
            else if (ch === '}') {
                braceDepth--;
                if (braceDepth === 0) { jsonEnd = i + 1; break; }
            }
        }
    }

    const jsonStr = content.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonStr);
}

// 生成 INSERT SQL
function generateInsertSQL(seedData) {
    const rows = [];
    let totalItems = 0;

    for (const [cId, items] of Object.entries(seedData)) {
        for (const item of items) {
            const safeContent = (item.content || '').replace(/'/g, "''");
            const safeTitle = (item.title || '').replace(/'/g, "''");
            const safePic = (item.pic || '').replace(/'/g, "''");
            const safeAddtime = item.addtime || new Date().toISOString();

            rows.push(`INSERT OR REPLACE INTO cms_items (c_id, i_id, title, pic, content, addtime) VALUES (${cId}, ${item.i_id}, '${safeTitle}', '${safePic}', '${safeContent}', '${safeAddtime}');`);
            totalItems++;
        }
    }

    return { sql: rows.join('\n'), totalItems };
}

async function main() {
    console.log('🔄 正在读取 seed_data.js...');
    const seedData = extractSeedData();

    console.log(`📊 发现 ${Object.keys(seedData).length} 个栏目, ${Array.from(Object.values(seedData)).reduce((a, b) => a + b.length, 0)} 个条目`);

    const { sql, totalItems } = generateInsertSQL(seedData);

    if (DRY_RUN) {
        console.log(`\n📝 [DRY RUN] 将执行 ${totalItems} 条 INSERT`);
        console.log('\n前 5 条 SQL:');
        console.log(sql.split('\n').slice(0, 5).join('\n'));
        console.log('\n后 5 条 SQL:');
        console.log(sql.split('\n').slice(-5).join('\n'));
        console.log(`\nSQL 文件大小: ${(sql.length / 1024).toFixed(1)} KB`);
    } else {
        // 写入 SQL 文件（可手动执行）
        const sqlFile = path.join('d1', 'seed_data_insert.sql');
        fs.writeFileSync(sqlFile, sql, 'utf8');
        console.log(`\n✅ SQL 文件已生成: ${sqlFile}`);
        console.log(`📝 共 ${totalItems} 条 INSERT 语句`);
        console.log(`📦 文件大小: ${(sql.length / 1024).toFixed(1)} KB`);
    }
}

main().catch(console.error);
