export const getDebts = (transactions: any[]) => {
  const totalDebt = transactions
    .filter(t => t.type === "debt")
    .reduce((s, t) => s + t.amount, 0);

  const totalLoan = transactions
    .filter(t => t.type === "loan")
    .reduce((s, t) => s + t.amount, 0);

  return { totalDebt, totalLoan };
};