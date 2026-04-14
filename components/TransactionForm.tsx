import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export const TransactionForm = ({
  type,
  setType,
  category,
  setCategory,
  currency,
  setCurrency,
  amount,
  setAmount,
  addTransaction,
  loadingBtn
}: any) => {

  return (
    <div style={{
      background:"#1e1e2f",
      padding:"15px",
      borderRadius:"15px",
      marginTop:"10px"
    }}>
      
      {/* TYPE */}
      <Select
        value={type}
        onChange={(e:any)=>setType(e.target.value)}
        options={[
          { value: "income", label: "Доход" },
          { value: "expense", label: "Расход" },
          { value: "debt", label: "Долг" },
          { value: "loan", label: "Займ" }
        ]}
      />

      {/* CATEGORY */}
      <Select
        value={category}
        onChange={(e:any)=>setCategory(e.target.value)}
        options={[
          { value: "food", label: "Еда" },
          { value: "transport", label: "Транспорт" },
          { value: "entertainment", label: "Развлечения" },
          { value: "investment", label: "Инвестиции" },
          { value: "business", label: "Бизнес" },
          { value: "health", label: "Здоровье" },
          { value: "other", label: "Прочее" }
        ]}
      />

      {/* CURRENCY */}
      <Select
        value={currency}
        onChange={(e:any)=>setCurrency(e.target.value)}
        options={[
          { value: "UZS", label: "UZS" },
          { value: "USD", label: "USD" }
        ]}
      />

      {/* AMOUNT */}
      <Input
        value={amount}
        onChange={(e:any)=>setAmount(e.target.value)}
        placeholder="Сумма"
      />

      {/* BUTTON */}
      <Button onClick={addTransaction} loading={loadingBtn}>
        ➕ Добавить
      </Button>

    </div>
  );
};