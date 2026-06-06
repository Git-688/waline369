const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // 成就系统：根据用户评论总数显示徽章
    if (!comment || !comment.user_id || !comment.objectId) {
      return;
    }

    try {
      const { ctx } = comment;
      // 获取 Comment 模型（兼容不同 Waline 版本）
      const CommentModel = ctx.model?.Comment || ctx.service?.comment?.model;
      if (!CommentModel) {
        console.warn('[成就] Comment model not available');
        return;
      }

      // 统计该用户的评论总数（包括当前这条）
      const count = await CommentModel.count({ user_id: comment.user_id });
      
      let achievement = '';
      if (count >= 100) {
        achievement = '评论大神';
      } else if (count >= 50) {
        achievement = '评论达人';
      } else if (count >= 10) {
        achievement = '活跃评论者';
      }

      if (achievement) {
        // 更新当前评论的 meta 字段
        await CommentModel.updateOne(
          { objectId: comment.objectId },
          { $set: { 'meta.achievement': achievement } }
        );
        console.log(`[成就] 用户 ${comment.user_id} 获得 ${achievement}（总评论数 ${count}）`);
      }
    } catch (err) {
      // 成就记录失败不影响评论保存，仅输出错误日志
      console.error('[成就] 更新失败:', err.message);
    }
  },
});