import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    // 🔥 если нет ключа → fallback
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer:
          "⚠️ Нет API ключа. Добавь OPENAI_API_KEY в .env.local или Vercel"
      });
    }

    const body = await req.json();

    const transactions = Array.isArray(body.transactions)
      ? body.transactions
      : [];

    const question = body.question || "Дай совет по финансам";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    // 🔥 считаем финансы
    const income = transactions
      .filter((t: any) => t.type === "income")
      .reduce((s: number, t: any) => s + Number(t.amount), 0);

    const expense = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((s: number, t: any) => s + Number(t.amount), 0);

    const balance = income - expense;

    // 🔥 категории расходов
    const categories: Record<string, number> = {};

    transactions.forEach((t: any) => {
      if (t.type === "expense") {
        categories[t.category] =
          (categories[t.category] || 0) + Number(t.amount);
      }
    });

    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // 🔥 prompt
    const prompt = `
Ты профессиональный финансовый консультант.

Финансы пользователя:
Доход: ${income}
Расход: ${expense}
Баланс: ${balance}

ТОП РАСХОДЫ:
${topCategories
  .map((c) => `${c[0]}: ${c[1]}`)
  .join("\n")}

Вопрос:
${question}

Отвечай строго:

АНАЛИЗ:
(что происходит)

ОШИБКИ:
(конкретные проблемы)

СОВЕТЫ:
(конкретные действия)
`;

    // 🔥 ChatGPT с памятью
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты финансовый консультант. Даёшь конкретные, полезные и честные советы."
        },

        // 🔥 история диалога
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.text
        })),

        // 🔥 текущий запрос
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "AI не дал ответа";

    return NextResponse.json({ answer });

  } catch (e: any) {
    console.error("AI ERROR:", e);

    return NextResponse.json({
      answer:
        "⚠️ Ошибка AI. Проверь API ключ или структуру запроса"
    });
  }
}