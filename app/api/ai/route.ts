import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты финансовый помощник. Давай короткие и полезные советы.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return new Response(
      JSON.stringify({
        answer: response.choices[0].message.content,
      }),
      { status: 200 }
    );
  } catch (error: any) {
  console.log("AI ERROR:", error);

  return new Response(
    JSON.stringify({
      answer: "Ошибка: " + (error.message || "неизвестно"),
    }),
    { status: 500 }
  );
}
}