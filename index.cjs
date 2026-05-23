// index.cjs
const Waline = require('@waline/vercel');

module.exports = Waline({
  // 明确允许的域名（必须与前端完全一致，含协议）
  secureDomains: [
    'https://xjdh688.ccwu.cc',
    'https://www.xjdh688.ccwu.cc',
    'http://localhost:3000',
  ],
  // 关闭登录要求（若不需要强制登录）
  login: 'disable',   // 或 'enable' 取决于需求
  // 数据库配置（根据你的实际情况填写）
  // database: {
  //   type: 'leancloud', // 或 'mysql', 'mongodb' 等
  //   ...
  // },
  // 其他可选配置
  pageSize: 10,
  avatar: 'mp',
  lang: 'zh-CN',
});