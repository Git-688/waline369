const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // 获取用户评论总数（通过邮箱 hash 判断同一用户）
    const userId = comment.user_id;
    // 注意：此处需要根据实际 Waline 版本获取数据库实例
    // 以下代码为示例，实际需查阅 Waline 文档或使用内置方法
    try {
      // 假设 ctx 中有 db 实例（Waline 内部 Koa 上下文）
      const db = comment.ctx?.db;
      if (db) {
        const count = await db.count('Comment', { user_id: userId });
        let achievement = '';
        if (count >= 100) achievement = '评论大神';
        else if (count >= 50) achievement = '评论达人';
        else if (count >= 10) achievement = '活跃评论者';
        if (achievement) {
          await db.update('Comment', comment.objectId, { meta: { ...comment.meta, achievement } });
        }
      }
    } catch (err) {
      console.error('成就系统记录失败:', err);
    }
  },
});