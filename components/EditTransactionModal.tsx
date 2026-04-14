export const EditTransactionModal = ({
  editTx,
  setEditTx,
  updateTransaction
}: any) => {

  if (!editTx) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    }}>
      <div style={{
        background: "#1e1e2f",
        padding: "20px",
        borderRadius: "12px",
        width: "300px"
      }}>
        
        <h3 style={{marginBottom:"10px"}}>Редактировать</h3>

        <input
          value={editTx.amount}
          onChange={(e)=>setEditTx({...editTx, amount:e.target.value})}
          placeholder="Сумма"
          style={{
            width:"100%",
            padding:"10px",
            borderRadius:"8px",
            border:"none",
            marginTop:"5px"
          }}
        />

        <button
          onClick={updateTransaction}
          style={{
            width:"100%",
            marginTop:"10px",
            padding:"12px",
            background:"#00ffae",
            border:"none",
            borderRadius:"10px",
            fontWeight:"bold"
          }}
        >
          💾 Сохранить
        </button>

        <button
          onClick={()=>setEditTx(null)}
          style={{
            width:"100%",
            marginTop:"5px",
            padding:"12px",
            background:"#ff4d6d",
            border:"none",
            borderRadius:"10px",
            color:"#fff"
          }}
        >
          ❌ Отмена
        </button>

      </div>
    </div>
  );
};