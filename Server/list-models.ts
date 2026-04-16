import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.list();
    for await (const m of res) {
      if (m.name.includes('imagen')) console.log(m.name);
      if (m.name.includes('image')) console.log(m.name);
    }
    console.log("Done");
  } catch (e) { console.error(e); }
}
run();
