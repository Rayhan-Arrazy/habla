import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { text, type, level = "A1", apiKey } = await req.json();

    const actualKey = apiKey || process.env.GEMINI_API_KEY;

    if (!actualKey) {
      return NextResponse.json({ error: "MISSING_API_KEY" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: actualKey });

    let systemPrompt = '';
    
    if (type === 'translate') {
      systemPrompt = `You are a helpful Spanish teacher. Translate the given text to Spanish if it is in English, or to English if it is in Spanish. The learner is at CEFR level ${level}. Provide the translation, and a brief grammar tip or explanation if applicable. Format as JSON with "translation" and "explanation" keys.`;
    } else if (type === 'word_of_day') {
      systemPrompt = `Generate a random, useful Spanish word suitable for a CEFR level ${level} learner. Make sure it's a NEW word, rarely generated before. Return a JSON object with keys: "spanish", "english", "exampleSentenceEs", "exampleSentenceEn".`;
    } else if (type === 'quiz') {
      systemPrompt = `Generate 3 multiple choice Spanish questions suitable for a CEFR level ${level} learner. Return a JSON array of objects, each with: "question" (in Spanish or English), "options" (array of 4 strings), "correctAnswer" (index 0-3 of correct option), "explanation" (in English, explaining why). Ensure variety and focus on grammar and vocabulary.`;
    } else if (type === 'explore') {
      systemPrompt = `Generate 6 random Spanish words or short phrases suitable for a CEFR level ${level} learner. They should be thematically grouped (e.g., travel, food, feelings). Return a JSON array of objects, each with: "spanish", "english", "exampleSentenceEs", "exampleSentenceEn".`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: text || `Generate content for today at level ${level}` }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.9,
      }
    });

    const result = response.text || '{}';
    
    let parsed = JSON.parse(result);
    
    // Unwrap if it's placed inside a root key like {"questions": [...]} or {"words": [...]}
    if (type === 'quiz' && !Array.isArray(parsed)) {
      parsed = parsed.questions || parsed.quiz || Object.values(parsed)[0];
    } else if (type === 'explore' && !Array.isArray(parsed)) {
      parsed = parsed.words || parsed.phrases || Object.values(parsed)[0];
    }
    
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('[TRANSLATE_ERROR]', error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
