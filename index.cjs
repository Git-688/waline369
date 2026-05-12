const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async preSave(comment) {
    // 检查是否已有IP信息
    if (!comment.ip) {
      return;
    }

    try {
      // 调用你提供的API查询归属地
      const apiUrl = `https://cn.apihz.cn/api/ip/ipjh.php?id=10014221&key=4a7768de1cf2e0f41fc0a4005240c837&ip=${comment.ip}&type=2`;
      console.log(`[归属地查询] 正在查询IP: ${comment.ip}`); // 调试日志
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log(`[归属地查询] API返回状态: ${data.code}`); // 调试日志

      if (data.code === 200 && data.no1) {
        // 提取并拼接地址信息 (国家-省份-城市-区县-运营商)
        const addressParts = [data.no1.guo, data.no1.sheng, data.no1.shi, data.no1.qu, data.no1.isp];
        const fullAddress = addressParts.filter(part => part != null).join(' ');
        comment.region = fullAddress;
        console.log(`[归属地查询] 查询结果: ${fullAddress}`); // 调试日志
      } else {
        console.error(`[归属地查询] API返回错误, IP: ${comment.ip}, 响应:`, data); // 错误日志
      }
    } catch (error) {
      console.error(`[归属地查询] 查询失败, IP: ${comment.ip}, 错误:`, error); // 异常日志
    }
  },
});