// d1-api.js - Cloudflare Worker API for CMS
// 部署: wrangler deploy

export default {
  async fetch(request, env, ctx) {
    // CORS 处理
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ===== 路由处理 =====

      // GET /api/items?c_id=1&page=1&size=12
      if (path === '/api/items' && request.method === 'GET') {
        const cId = url.searchParams.get('c_id');
        const page = parseInt(url.searchParams.get('page') || '1');
        const size = parseInt(url.searchParams.get('size') || '12');
        const offset = (page - 1) * size;

        let sql = 'SELECT * FROM cms_items';
        const params = [];

        if (cId) {
          sql += ' WHERE c_id = ?';
          params.push(cId);
        }

        sql += ' ORDER BY i_id DESC LIMIT ? OFFSET ?';
        params.push(size, offset);

        const { results } = await env.DB.prepare(sql).bind(...params).all();

        // 获取总数
        let countSql = 'SELECT COUNT(*) as total FROM cms_items';
        if (cId) {
          countSql += ' WHERE c_id = ?';
        }
        const { results: countResults } = await env.DB.prepare(countSql)
          .bind(cId || '')
          .all();
        const total = countResults[0]?.total || 0;

        return Response.json({
          success: true,
          data: results,
          pagination: { page, size, total, pages: Math.ceil(total / size) }
        }, { headers: corsHeaders });
      }

      // GET /api/items/:i_id
      if (path.startsWith('/api/items/') && request.method === 'GET') {
        const iId = path.split('/')[3];
        const { results } = await env.DB.prepare(
          'SELECT * FROM cms_items WHERE i_id = ?'
        ).bind(iId).all();

        if (!results.length) {
          return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        }

        return Response.json({ success: true, data: results[0] }, { headers: corsHeaders });
      }

      // POST /api/items - 创建新条目
      if (path === '/api/items' && request.method === 'POST') {
        const body = await request.json();
        const { c_id, i_id, title, pic, content, addtime } = body;

        // 如果没有 i_id，自动生成
        const nextId = i_id || await getNextId(env, c_id);

        const { meta } = await env.DB.prepare(
          'INSERT INTO cms_items (c_id, i_id, title, pic, content, addtime) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(c_id, nextId, title, pic, content, addtime || new Date().toISOString()).run();

        return Response.json({ success: true, data: { i_id: nextId, ...meta } }, { headers: corsHeaders });
      }

      // PUT /api/items/:i_id - 更新条目
      if (path.startsWith('/api/items/') && request.method === 'PUT') {
        const iId = path.split('/')[3];
        const body = await request.json();

        const { changes } = await env.DB.prepare(`
          UPDATE cms_items SET title=?, pic=?, content=?, addtime=? WHERE i_id=?
        `).bind(body.title, body.pic, body.content, body.addtime || new Date().toISOString(), iId).run();

        if (!changes) {
          return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        }

        return Response.json({ success: true, changes }, { headers: corsHeaders });
      }

      // DELETE /api/items/:i_id - 删除条目
      if (path.startsWith('/api/items/') && request.method === 'DELETE') {
        const iId = path.split('/')[3];
        const { changes } = await env.DB.prepare(
          'DELETE FROM cms_items WHERE i_id = ?'
        ).bind(iId).run();

        if (!changes) {
          return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        }

        return Response.json({ success: true, changes }, { headers: corsHeaders });
      }

      // GET /api/categories - 获取所有栏目统计
      if (path === '/api/categories' && request.method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT c_id, COUNT(*) as count, MAX(addtime) as last_updated
          FROM cms_items
          GROUP BY c_id
          ORDER BY c_id
        `).all();

        return Response.json({ success: true, data: results }, { headers: corsHeaders });
      }

      return Response.json({ success: false, error: 'Not found' }, { status: 404, headers: corsHeaders });

    } catch (e) {
      console.error('API Error:', e);
      return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
    }
  }
};

async function getNextId(env, cId) {
  const { results } = await env.DB.prepare(
    'SELECT MAX(i_id) as max_id FROM cms_items WHERE c_id = ?'
  ).bind(cId).all();
  return (results[0]?.max_id || 0) + 1;
}
