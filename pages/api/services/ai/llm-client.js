import { GoogleGenerativeAI } from "@google/generative-ai";
import { Counter } from 'prom-client';

// Create metrics for tracking token usage
export const aiTokenUsage = new Counter({
  name: 'ai_tokens_used_total',
  help: 'Total AI tokens consumed',
  labelNames: ['provider', 'model']
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeWithGemini(prompt, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract token usage from response if available
    const usage = result.response.candidates?.[0]?.tokenCount || 0;

    // Track token usage
    aiTokenUsage.inc({
      provider: 'gemini',
      model: 'gemini-pro'
    }, usage);

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// Enhanced version that maintains conversation context
export async function analyzeWithGeminiChat(messages, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format messages for Gemini
    let formattedPrompt = "";
    messages.forEach((msg, index) => {
      const role = msg.role === 'user' ? 'Human' : 'Assistant';
      formattedPrompt += `${role}: ${msg.content}\n`;
    });

    // Add a final instruction for the AI to respond
    formattedPrompt += "Assistant:";

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();

    // Extract token usage from response if available
    const usage = result.response.candidates?.[0]?.tokenCount || 0;

    // Track token usage
    aiTokenUsage.inc({
      provider: 'gemini',
      model: 'gemini-pro'
    }, usage);

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// Specialized function for JSON responses
export async function getGeminiJSONResponse(prompt, schemaDescription) {
  const fullPrompt = `
    ${prompt}

    Please provide your response in valid JSON format that conforms to this structure:
    ${schemaDescription}

    Respond only with the JSON object, no additional text.
  `;

  return await analyzeWithGemini(fullPrompt);
}