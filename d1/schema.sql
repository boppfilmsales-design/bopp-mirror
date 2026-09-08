-- D1 数据库 schema for BOPP 镜像站
-- 部署: wrangler d1 execute bopp-mirror --file= schema.sql

-- 栏目信息表（对应原 seed_data.js 中的 categories）
CREATE TABLE IF NOT EXISTS cms_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    c_id INTEGER NOT NULL,           -- 栏目 ID（对应原 JSON key）
    i_id INTEGER NOT NULL,           -- 条目 ID（唯一标识）
    title TEXT,                       -- 标题
    pic TEXT,                         -- 图片路径
    content TEXT,                     -- 正文 HTML
    addtime TEXT,                     -- 添加时间
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(c_id, i_id)               -- 防止重复插入
);

-- 索引：按栏目查询（前端最常按 c_id 读取）
CREATE INDEX IF NOT EXISTS idx_cms_items_c_id ON cms_items(c_id);

-- 索引：按 i_id 查询（编辑单个条目）
CREATE INDEX IF NOT EXISTS idx_cms_items_i_id ON cms_items(i_id);

-- 配置表（原 localStorage CFG）
CREATE TABLE IF NOT EXISTS cms_config (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- 留言表（原 localStorage MSG）
CREATE TABLE IF NOT EXISTS cms_messages (
    m_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    content TEXT,
    addtime TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 管理员表（原 localStorage ADM）
CREATE TABLE IF NOT EXISTS cms_admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    created_at TEXT DEFAULT (datetime('now'))
);

-- 角色表（原 localStorage ROL）
CREATE TABLE IF NOT EXISTS cms_roles (
    role TEXT PRIMARY KEY,
    permissions TEXT  -- JSON 数组
);

-- 初始化默认管理员（密码：admin123，实际部署后应立即修改）
INSERT OR IGNORE INTO cms_admins (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT OR IGNORE INTO cms_roles (role, permissions) VALUES ('admin', '["all"]');
INSERT OR IGNORE INTO cms_roles (role, permissions) VALUES ('editor', '["read","write"]');
