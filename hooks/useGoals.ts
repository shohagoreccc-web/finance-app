import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const useGoals = (user: any) => {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setGoals([]);
      return;
    }

    const q = query(
      collection(db, "goals"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGoals(data);
    });

    return () => unsub();
  }, [user?.uid]);

  return { goals };
};