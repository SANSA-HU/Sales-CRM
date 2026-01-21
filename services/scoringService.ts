
import { Client, ClientStatus } from '../types';

export const calculateLeadScore = (client: Client): number => {
  let score = 20; // Base score

  // Source scoring
  if (client.source.includes('大客户推荐') || client.source.includes('VIP')) score += 40;
  else if (client.source.includes('官网') || client.source.includes('询盘')) score += 25;
  else if (client.source.includes('展会')) score += 15;
  else if (client.source.includes('领英')) score += 10;

  // Scale scoring
  if (client.scale.toLowerCase().includes('sqm') || client.scale.includes('台')) {
    const numbers = client.scale.match(/\d+/g);
    if (numbers) {
      const maxNum = Math.max(...numbers.map(Number));
      if (maxNum > 1000 || maxNum > 100) score += 20;
      else score += 10;
    }
  }

  // Status scoring
  if (client.status === ClientStatus.SIGNED) return 100;
  if (client.status === ClientStatus.NEGOTIATING) score += 15;

  // Activity scoring
  score += Math.min(client.logs.length * 5, 15);

  return Math.min(score, 99);
};
