// Waline V3 服务端入口，使用 MySQL 适配器连接 TiDB
const { Application } = require('@waline/vercel');
const { MySQLStore } = require('@waline/store');

// 从环境变量读取 TiDB 连接参数（兼容 V2 变量名）
const dbOptions = {
  host: process.env.TIDB_HOST || process.env.MYSQL_HOST,
  port: parseInt(process.env.TIDB_PORT || process.env.MYSQL_PORT || '4000'),
  user: process.env.TIDB_USER || process.env.MYSQL_USER,
  password: process.env.TIDB_PASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.TIDB_DB || process.env.MYSQL_DB,
  // TiDB Serverless 必须启用 SSL，设置 rejectUnauthorized: false
  ssl: process.env.TIDB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  // 连接池配置（可选）
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  // 时区设置（中国时区）
  timezone: '+08:00',
};

// 初始化数据库存储实例
const store = new MySQLStore(dbOptions);

// 创建 Waline 应用并导出（Vercel 函数）
module.exports = Application({
  store,                      // 必须：数据库存储
  plugins: [],                // 可扩展插件列表
  async postSave(comment) {   // 保存后的钩子（可选）
    console.log(`[Waline] New comment saved: ${comment.objectId}`);
    // 可在此添加 Webhook 通知、垃圾过滤等逻辑
  },
});