export const runtime = "nodejs";

import OpenAI from "openai";
import { analyzeData } from "@/services/ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { text, transactions, debts, goals } = body;

    // защита от undefined
    const data = analyzeData(transactions || [], debts || []);

    const prompt = `
Ты профессиональный финансовый консультант.

Ты НЕ чат-бот.
Ты работаешь как эксперт, который помогает человеку выбраться из финансовых проблем.

Данные пользователя:
Доход: ${data.income}
Расходы: ${data.expenses}
Баланс: ${data.balance}
Категории расходов: ${JSON.stringify(data.categories)}
Долги: ${JSON.stringify(data.debts)}

Вопрос пользователя:
${text || "Проанализируй мои финансы"}

Твоя задача:

1. Чётко проанализировать ситуацию:
- есть ли дефицит или профицит
- насколько серьёзная ситуация

2. Найти КОНКРЕТНЫЕ проблемы

3. Дать ПЛАН ДЕЙСТВИЙ:
- какие расходы сократить (с цифрами)
- как закрыть долги
- как выйти в плюс

4. Говори ЖЁСТКО, но по делу (без воды)

Формат ответа:

📊 Анализ:
...

❌ Проблемы:
...

✅ План:
1.
2.
3.

💡 Совет:
...
`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: text || "Дай анализ",
        },
      ],
    });

    // 🔥 ВАЖНО — безопасное получение ответа
    const answer =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "AI не дал ответ";

    return new Response(
      JSON.stringify({
        answer,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("AI ERROR FULL:", error);

    return new Response(
      JSON.stringify({
        answer: "Ошибка: " + (error.message || "неизвестно"),
      }),
      { status: 500 }
    );
  }
}