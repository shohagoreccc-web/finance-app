import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const saveUserProfile = async (uid: string, data: any) => {
  await setDoc(doc(db, "users", uid), data);
};