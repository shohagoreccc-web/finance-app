export const fetchAIAdvice = async (text: string) => {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error("AI error");
  }

  const data = await res.json();
  return data.answer;
};