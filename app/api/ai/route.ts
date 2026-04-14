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

2. Найти КОНКРЕТНЫЕ проблемы:
(например: "еда = 200$ это слишком много")

3. Дать ПЛАН ДЕЙСТВИЙ:

- какие расходы сократить (с цифрами)
- какие категории урезать
- как перераспределить деньги
- как закрыть долги (по шагам)
- сколько откладывать

4. Если есть долги:
- скажи как быстрее их закрыть
- предложи стратегию (снежный ком или приоритет)

5. Говори ЖЁСТКО, но полезно:
- без воды
- без общих фраз
- без "возможно" и "стоит подумать"

6. Пиши как наставник:
коротко, конкретно, по делу

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

    return new Response(
      JSON.stringify({
        answer: response.output_text,
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