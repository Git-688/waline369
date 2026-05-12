const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  // ✅ 使用 preSave 钩子，在保存前为评论注入归属地和设备信息
  async preSave(comment) {
    try {
      // 1. 解析归属地（region）
      const ip = comment.ip;
      if (ip) {
        try {
          const regionRes = await fetch(`https://api.pearapi.ai/api/ip/high/?ip=${ip}`);
          const regionData = await regionRes.json();

          if (regionData.code === 200 && regionData.data) {
            const { province, city } = regionData.data;
            // Waline 直接识别中国省份+城市的组合，国家可写死为“中国”
            comment.region = ['中国', province, city].filter(Boolean).join(' ');
          }
        } catch (err) {
          console.error('归属地解析失败:', err);
        }
      }

      // 2. 同时解析 UserAgent，让设备信息更详细
      const ua = comment.ua;
      if (ua) {
        try {
          const uaRes = await fetch(`https://api.pearapi.ai/api/ua/parse/?ua=${encodeURIComponent(ua)}`);
          const uaData = await uaRes.json();

          if (uaData.code === 200 && uaData.data) {
            const os = `${uaData.data.os.name} ${uaData.data.os.version || ''}`.trim();
            const browser = `${uaData.data.browser.name} ${uaData.data.browser.version || ''}`.trim();
            comment.browser = [os, browser].filter(Boolean).join(' | ');
          }
        } catch (err) {
          console.error('设备信息解析失败:', err);
        }
      }
    } catch (err) {
      // 任何意外都不会阻塞评论发布
      console.error('preSave 钩子异常:', err);
    }
  },
  // 如果你之后需要在评论保存后做其他事（如发通知），可以保留 postSave
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});