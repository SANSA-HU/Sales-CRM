
import { GoogleGenAI } from "@google/genai";
import { Client } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getClientInsight = async (client: Client) => {
  const prompt = `
    作为一名资深的全球化娱乐场地SaaS销售专家，请分析以下海外客户情况并提供针对性的跟进建议：
    公司名称: ${client.companyName}
    场地名称: ${client.venueName}
    所在国家/地区: ${client.country}
    场地类型: ${client.venueType}
    当前状态: ${client.status}
    规模: ${client.scale}
    最后沟通记录: ${client.notes}
    
    特别注意：请结合 ${client.country} 的市场特点、工作文化和时差等因素提供建议。
    
    请输出JSON格式：
    {
      "analysis": "结合地域特点的客户痛点分析",
      "strategy": "下一步跟进的具体策略（含建议的沟通工具如Email/WhatsApp）",
      "script": "一段推荐的专业英文或当地常用语言的邮件/沟通开场白"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateOutreachDraft = async (client: Client) => {
  const prompt = `
    作为 ArcaMaster SaaS 系统的销售经理，请为以下客户撰写一份个性化的开发信（Outreach Letter）。
    客户资料：
    - 公司: ${client.companyName}
    - 场地名称: ${client.venueName} (类型: ${client.venueType})
    - 地区: ${client.country}
    - 来源/推荐背景: ${client.source}
    - 备注/痛点: ${client.notes}
    - 现有规模: ${client.scale}

    要求：
    1. 语气专业、真诚，且具有吸引力。
    2. 针对客户的场地类型和可能的痛点（如效率、会员转化、跨国管理）提出价值主张。
    3. 如果来源是推荐，请在开头巧妙提及。
    4. 默认使用中英双语（或根据国家选择最合适的语言）。
    5. 结构清晰：SubjectLine, Body, Call to Action.

    请直接输出生成的文本内容。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Outreach Error:", error);
    return "抱歉，AI 暂时无法生成开发信，请稍后再试。";
  }
};

export const getPeriodSummary = async (clients: Client[], period: 'month' | 'year') => {
  const stats = {
    total: clients.length,
    signed: clients.filter(c => c.status === '已签约').length,
    negotiating: clients.filter(c => c.status === '商务洽谈').length,
    potential: clients.filter(c => c.status === '潜在客户').length,
    countries: Array.from(new Set(clients.map(c => c.country))).join(', ')
  };

  const prompt = `
    作为销售总监，请为这份${period === 'month' ? '月度' : '年度'}销售数据撰写总结报告：
    数据概览：
    - 总客户数: ${stats.total}
    - 已签约: ${stats.signed}
    - 洽谈中: ${stats.negotiating}
    - 潜在机会: ${stats.potential}
    - 覆盖国家: ${stats.countries}
    
    请输出JSON格式，包含以下字段：
    {
      "overview": "简短的总体表现评价",
      "highlights": ["列举2-3个业务亮点"],
      "risks": ["列举1-2个潜在风险"],
      "actions": ["下个阶段的3个核心行动计划"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Period Summary Error:", error);
    return null;
  }
};
