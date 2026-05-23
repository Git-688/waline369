// index.cjs
const Waline = require('@waline/vercel');

module.exports = Waline({
  // 安全域名配置，解决跨域问题
  secureDomains: [
    'https://xjdh688.ccwu.cc',
    'https://www.xjdh688.ccwu.cc',
    'http://localhost:3000',   // 本地开发
  ],
  // 你可以在此继续添加其他 Waline 配置项，例如：
  // database: {...},
  // avatar: 'mp',
  // pageSize: 10,
  // ...
});