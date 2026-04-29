import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// регистрация
export const registerUser = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  // отправка письма
  await sendEmailVerification(res.user);

  return res.user;
};

// вход
export const loginUser = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  if (!res.user.emailVerified) {
    throw new Error("Подтверди почту");
  }

  return res.user;
};