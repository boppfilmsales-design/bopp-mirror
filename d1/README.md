# D1 数据库迁移指南

## 1. 创建 D1 数据库

```bash
# 登录 Wrangler
npx wrangler login

# 创建数据库
npx wrangler d1 create bopp-mirror

# 记录输出的 database_id
```

## 2. 执行 Schema

```bash
# 执行 schema.sql
npx wrangler d1 execute bopp-mirror --file=d1/schema.sql

# 或指定 database_id
npx wrangler d1 execute bopp-mirror --database-id=YOUR_ID --file=d1/schema.sql
```

## 3. 迁移数据

```bash
# 生成 SQL 文件
node d1/migrate.js

# 执行迁移
npx wrangler d1 execute bopp-mirror --file=d1/seed_data_insert.sql
```

## 4. 部署 Worker

```bash
# 编辑 wrangler.toml，填入 database_id

# 部署
npx wrangler deploy d1/d1-api.js
```

## 5. 更新前端

将原有的 `XGXCMS_SEED` 替换为 API 调用：

```javascript
// 原代码
var items = XGXCMS_SEED[cid] || [];

// 新代码
fetch('/api/items?c_id=' + cid)
  .then(r => r.json())
  .then(r => r.data);
```

## 表结构

| 表名 | 说明 |
|------|------|
| `cms_items` | 栏目条目（产品/文章等） |
| `cms_config` | 配置项 |
| `cms_messages` | 留言 |
| `cms_admins` | 管理员 |
| `cms_roles` | 角色权限 |
