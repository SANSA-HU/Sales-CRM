
const countryTimezoneMap: Record<string, string> = {
  '新加坡': 'Asia/Singapore',
  'Singapore': 'Asia/Singapore',
  '美国': 'America/New_York',
  'USA': 'America/New_York',
  '英国': 'Europe/London',
  'UK': 'Europe/London',
  '日本': 'Asia/Tokyo',
  'Japan': 'Asia/Tokyo',
  '韩国': 'Asia/Seoul',
  'Korea': 'Asia/Seoul',
  '澳大利亚': 'Australia/Sydney',
  'Australia': 'Australia/Sydney',
  '德国': 'Europe/Berlin',
  'Germany': 'Europe/Berlin',
  '阿联酋': 'Asia/Dubai',
  'UAE': 'Asia/Dubai',
};

export const getClientLocalTimeInfo = (country: string) => {
  const match = Object.keys(countryTimezoneMap).find(key => country.includes(key));
  const tz = match ? countryTimezoneMap[match] : 'UTC';

  try {
    const now = new Date();
    const localStr = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const hour = parseInt(localStr.split(':')[0]);
    
    let advice = "";
    let isOptimal = false;

    if (hour >= 9 && hour <= 11) {
      advice = "黄金时段：正值当地上午工作高峰，建议立即发送开发信或致电。";
      isOptimal = true;
    } else if (hour >= 14 && hour <= 16) {
      advice = "午后时段：当地处理商务邮件的高峰期，回复率极高。";
      isOptimal = true;
    } else if (hour >= 0 && hour <= 6) {
      advice = "深夜休息：建议设置定时发送，在当地时间早晨 8:30 送达。";
    } else {
      advice = "常规时段：可以进行常规沟通。";
    }

    return {
      localTime: localStr,
      advice,
      isOptimal
    };
  } catch (e) {
    return { localTime: "--:--", advice: "无法获取时区信息", isOptimal: false };
  }
};
