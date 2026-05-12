const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async preSave(comment) {
    try {
      // ---------- 1. 归属地（region）解析 ----------
      const ip = comment.ip;
      if (ip) {
        try {
          // 新IP归属地API：apihz.cn（id 和 key 已替换为你提供的信息）
          const regionUrl = `https://cn.apihz.cn/api/ip/ipjh.php?id=10014221&key=4a7768de1cf2e0f41fc0a4005240c837&ip=${ip}&type=2`;
          const regionRes = await fetch(regionUrl);
          const regionData = await regionRes.json();

          if (regionData.code === 200 && regionData.no1) {
            // 直接使用 API 返回的完整描述字符串，如 “中国-四川省-绵阳市-涪城区-联通”
            comment.region = regionData.no1.msg;
          }
        } catch (err) {
          console.error('归属地解析失败:', err);
        }
      }

      // ---------- 2. 设备信息（browser）解析 ----------
      const ua = comment.ua;
      if (ua) {
        try {
          // ⚠️ 因为你提供的新 UA 接口不支持传入 UA 字符串，
          // 这里仍保留之前可用的 pearapi UA 解析接口，确保能正常工作。
          const uaUrl = `https://api.pearapi.ai/api/ua/parse/?ua=${encodeURIComponent(ua)}`;
          const uaRes = await fetch(uaUrl);
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
      // 即使钩子出错，也不影响评论正常发布
      console.error('preSave 钩子异常:', err);
    }
  },
  async postSave(comment) {
    // 预留，例如发送通知
  },
});