import { GoogleGenerativeAI } from '@google/generative-ai';

const PROMPTS = {
  solve: "Analyze this handwritten image. It could be math, physics, or chemistry. Solve it and return ONLY the final answer in one short line. No explanation, no steps, just the answer.",
  guess: "Look at this rough doodle/sketch. Guess what the user is trying to draw. Reply with ONLY a 1-sentence funny or enthusiastic guess. Nothing else."
};

export async function analyzeCanvas(actionType, base64ImageData) {
  const key = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) throw new Error('API Key missing. Add VITE_GEMINI_API_KEY to .env and restart dev server.');
  if (!base64ImageData) throw new Error('Canvas is empty. Draw something first.');

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const result = await model.generateContent([
    { text: PROMPTS[actionType] },
    { inlineData: { mimeType: 'image/jpeg', data: base64ImageData } }
  ]);

  return result.response.text();
}
