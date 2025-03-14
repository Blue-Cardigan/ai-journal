import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getGeminiResponse = async (prompt, context = '') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    // Verify the context is a string and not empty
    const contextString = typeof context === 'string' && context.trim() !== '' 
      ? context 
      : 'No journal entries available.';

    // Format the prompt with context
    const formattedPrompt = `
You are an empathetic AI journal companion. Here are the user's recent journal entries:

${contextString}

Based on these entries, provide a thoughtful response to the user's message:
"${prompt}"

Remember to:
1. Reference specific details from their journal entries when relevant
2. Show understanding of their emotional state based on their mood entries
3. Provide personalized insights and gentle support
4. Keep responses concise and conversational
`;

    // Log the formatted prompt for debugging (remove in production)
    console.log('Formatted prompt:', formattedPrompt);

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini API:', error);
    throw error;
  }
}; 