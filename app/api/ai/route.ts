import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { transactions, question } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // 🧠 простая сводка для контекста
    const summary = transactions.map((t: any) => {
      return `${t.type === "income" ? "Доход" : "Расход"}: ${t.amount} ${t.currency} (${t.category || "другое"})`;
    }).slice(0, 50).join("\n");

    const prompt = `
Ты финансовый ассистент. Дай краткий и полезный совет.

Данные:
${summary}

Вопрос: ${question || "Проанализируй мои финансы и дай рекомендации"}
    `;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const answer = res.choices?.[0]?.message?.content || "Нет ответа";

    return Response.json({ answer });
  } catch (e: any) {
    return Response.json({ answer: "Ошибка AI: " + e.message }, { status: 500 });
  }
}