"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export const useFinance = (user: any) => {

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📥 ЗАГРУЗКА
  useEffect(() => {

    if (!user?.uid) {
      console.log("❌ NO USER");

      setTransactions([]);
      setLoading(false);

      return;
    }

    console.log("👤 USER:", user.uid);

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {

      // 🔥 ГЛАВНЫЙ ФИКС
      const data = snapshot.docs.map((firebaseDoc) => ({
        ...firebaseDoc.data(),
        id: firebaseDoc.id // 🔥 ВСЕГДА В КОНЦЕ
      }));

      console.log("📥 FIREBASE DATA:", data);

      setTransactions(data);
      setLoading(false);

    });

    return () => unsub();

  }, [user?.uid]);

  // ➕ ДОБАВИТЬ
  const addTransaction = async (tx: any) => {

    if (!user?.uid) {
      console.log("❌ USER NOT FOUND");
      return;
    }

    try {

      // 🔥 защита от старого id
      const cleanTx = { ...tx };

      delete cleanTx.id;

      console.log("🔥 ADD TX START:", cleanTx);

      await addDoc(collection(db, "transactions"), {
        ...cleanTx,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      console.log("✅ ADD TX SUCCESS");

    } catch (error) {

      console.error("❌ ADD TX ERROR:", error);

    }
  };

  // ❌ УДАЛИТЬ
  const deleteTransaction = async (id: string) => {

    try {

      console.log("🗑 DELETE ID:", id);

      await deleteDoc(doc(db, "transactions", id));

      console.log("✅ DELETED:", id);

    } catch (e) {

      console.error("❌ DELETE ERROR:", e);

    }
  };

  // ✏️ ОБНОВИТЬ
  const updateTransaction = async (updated: any) => {

    try {

      if (!updated?.id) {
        console.log("❌ UPDATE ID NOT FOUND");
        return;
      }

      // 🔥 не сохраняем id внутрь Firestore
      const cleanData = { ...updated };

      delete cleanData.id;

      await updateDoc(
        doc(db, "transactions", updated.id),
        cleanData
      );

      console.log("✏️ UPDATED:", updated.id);

    } catch (e) {

      console.error("❌ UPDATE ERROR:", e);

    }
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loading
  };
};