const { Application } = require('@waline/vercel');
const MySQLStore = require('@waline/mysql');

// 从环境变量读取 TiDB 连接信息
const dbOptions = {
  host: process.env.TIDB_HOST,
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DB,
  // TiDB Serverless 需要 SSL，建议添加以下配置
  ssl: process.env.TIDB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  // 连接池配置（可选）
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
};

// 初始化 MySQL 存储实例
const store = new MySQLStore(dbOptions);

// 创建 Waline 应用
module.exports = Application({
  // 数据库存储
  store,
  // 插件（可扩展）
  plugins: [],
  // 自定义异步钩子
  async postSave(comment) {
    // 保存后可做额外处理，例如发送 Webhook 或邮件通知
    // 当前留空，可根据需要实现
    console.log('[Waline] New comment saved:', comment.objectId);
  },
  // 可选：自定义配置（部分配置也可通过环境变量覆盖）
  // 但建议在 Vercel 环境变量中设置以下 Waline 支持的标准变量：
  // SITE_NAME, SITE_URL, SERVER_URL, SMTP_*, AKISMET_KEY, IPQPS, SECURE_DOMAINS 等
});