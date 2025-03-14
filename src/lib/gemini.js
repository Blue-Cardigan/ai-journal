import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_NATIVE_GEMINI_API_KEY || 'your-gemini-api-key';
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw error;
  }
}; 