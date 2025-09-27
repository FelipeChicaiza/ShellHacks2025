import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://api.gemini.example/v1/generate';

export async function summarizeText(text, options = {}) {
  if (!GEMINI_API_KEY) {
    // fallback: naive summarization
    return text.slice(0, 160) + (text.length > 160 ? '…' : '');
  }

  // call Gemini ADK endpoint (this is a simplified example; ADK usage may differ)
  const resp = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GEMINI_API_KEY}` },
    body: JSON.stringify({ prompt: `Summarize the following text:
\n${text}
`, max_tokens: options.maxTokens || 256 })
  });

  if (!resp.ok) throw new Error(`Gemini ADK error: ${resp.status} ${resp.statusText}`);
  const body = await resp.json();
  // assume body.choices[0].text or similar
  return body?.choices?.[0]?.text || body?.output || '';
}
