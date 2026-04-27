"use client";

export const GoalsScreen = ({
  goals,
  goalName,
  setGoalName,
  goalAmount,
  setGoalAmount,
  goalCurrency,
  setGoalCurrency,
  addGoal,
  safeTransactions,
  user,
  deleteGoal
}: any) => {
  return (
    <>
      <h2>🎯 Мои цели</h2>

      <div style={{
        background:"#1e1e2f",
        padding:"15px",
        borderRadius:"15px",
        marginTop:"10px"
      }}>
        <input
          placeholder="Моя цель"
          value={goalName}
          onChange={(e)=>setGoalName(e.target.value)}
          style={{width:"100%",marginBottom:"5px"}}
        />

        <input
          placeholder="Сумма цели"
          value={goalAmount}
          onChange={(e)=>setGoalAmount(e.target.value)}
          style={{width:"100%",marginBottom:"5px"}}
        />

        <select
          value={goalCurrency}
          onChange={(e)=>setGoalCurrency(e.target.value)}
          style={{
            width:"100%",
            marginBottom:"5px",
            padding:"10px",
            borderRadius:"8px",
            background:"#2a2a3d",
            color:"#fff",
            border:"none"
          }}
        >
          <option value="USD">USD</option>
          <option value="UZS">UZS</option>
        </select>

        <button
          onClick={addGoal}
          style={{
            width:"100%",
            padding:"10px",
            background:"#22c55e",
            border:"none",
            borderRadius:"10px"
          }}
        >
          ➕ Добавить цель
        </button>
      </div>

      {goals.map((g: any, i: number) => {

        const saved = safeTransactions
          .filter((t: any) => t.type === "goal" && t.goalId === g.id)
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        const percent = Math.min((saved / g.amount) * 100, 100);

        return (
          <div key={i} style={{
            background:"#1e1e2f",
            padding:"15px",
            borderRadius:"15px",
            marginTop:"10px"
          }}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <b>{g.name}</b>

              <button
                onClick={() => deleteGoal(g.id)}
                style={{background:"none",border:"none",color:"red"}}
              >
                ❌
              </button>
            </div>

            <div style={{fontSize:"12px",opacity:0.6}}>
              {saved} / {g.amount} {g.currency}
            </div>

            <div style={{
              height:"6px",
              background:"#333",
              borderRadius:"10px",
              marginTop:"5px"
            }}>
              <div style={{
                width:`${percent}%`,
                height:"100%",
                background:"#22c55e",
                borderRadius:"10px"
              }}/>
            </div>
          </div>
        );
      })}
    </>
  );
};