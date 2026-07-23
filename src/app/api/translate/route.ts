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
    } else if (type === 'reading') {
      systemPrompt = `Write a short, engaging Spanish story (about 150-300 words) suitable for a CEFR level ${level} learner. Include a title. After the story, generate 3 multiple-choice comprehension questions in English or Spanish depending on level. Return a JSON object with keys: "title", "story", "questions". The "questions" should be an array of objects, each with: "question", "options" (array of 4 strings), "correctAnswer" (index 0-3), and "explanation" (in English).`;
    } else if (type === 'listening') {
      systemPrompt = `Generate a single, natural Spanish sentence suitable for a CEFR level ${level} learner to practice listening dictation. Return a JSON object with: "spanish" (the sentence), "english" (the translation), and "tips" (a string explaining tricky pronunciation rules in this sentence).`;
    } else if (type === 'assistant') {
      systemPrompt = `You are Habla AI, an expert, friendly Spanish tutor. The learner is level ${level}. Answer their grammar questions or requests in a supportive tone. Format response as JSON with "reply" (your markdown text response).`;
    } else if (type === 'conversation') {
      systemPrompt = `You are a native Spanish speaker doing a roleplay conversation with a level ${level} learner. Keep your responses short (1-2 sentences), natural, and realistic for a chat. Correct them gently if they make a major mistake. Format response as JSON with "reply" (your conversational response in Spanish) and "translation" (English translation).`;
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
