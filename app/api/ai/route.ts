export const runtime = "nodejs";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: text || "Привет",
    });

    return new Response(
      JSON.stringify({
        answer: response.output_text || "Нет ответа",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("AI REAL ERROR:", error);

    return new Response(
      JSON.stringify({
        answer: "Ошибка: " + error.message,
      }),
      { status: 500 }
    );
  }
}