import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

export async function addTransactionService(user: any, data: any) {
  if (!user) throw new Error("No user");

  return await addDoc(collection(db, "transactions"), {
    userId: user.uid,
    ...data,
    date: new Date(),
    createdAt: serverTimestamp()
  });
}

export async function deleteTransactionService(id: string) {
  if (!id) throw new Error("No ID");

  return await deleteDoc(doc(db, "transactions", id));
}

export async function updateTransactionService(editTx: any) {
  if (!editTx?.id) throw new Error("No transaction ID");

  return await updateDoc(doc(db, "transactions", editTx.id), {
    amount: Number(editTx.amount),
    category: editTx.category,
    type: editTx.type,
  });
}