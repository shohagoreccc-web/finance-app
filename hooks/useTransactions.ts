import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";

export const useTransactions = (user: any) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc") // 🔥 сортировка
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log("TRANSACTIONS:", data); // 🔥 для проверки

          setTransactions(data);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore error:", error);

          // 🔥 fallback (если orderBy ломается)
          const q2 = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid)
          );

          const unsub2 = onSnapshot(q2, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));

            setTransactions(data);
            setLoading(false);
          });

          return () => unsub2();
        }
      );

      return () => unsub();
    } catch (e) {
      console.error("Hook crash:", e);
      setLoading(false);
    }
  }, [user?.uid]);

  return { transactions, loading };
};