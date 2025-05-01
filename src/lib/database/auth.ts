import { db } from "./firebase_config";
import { doc, getDoc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const DEFAULT_NEW_USER_FUNDS = 0.1; // New user bonus

interface LoginCodeDoc {
  telegramId: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

interface UserDoc {
  userId: string;
  funds: number;
  createdAt: Date;
}

interface LoginCodeDoc {
  telegramId: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

export async function validateLoginCode(code: string) {
  // Check if code exists in Firestore
  const codeRef = doc(db, "login_codes", code);
  const codeSnap = await getDoc(codeRef);

  if (!codeSnap.exists()) {
    return { valid: false, error: "Invalid login code" };
  }

  const codeData = codeSnap.data() as LoginCodeDoc;

  // Check if code is expired
  if (new Date() > new Date(codeData.expiresAt)) {
    await deleteDoc(codeRef); // Clean up expired code
    return { valid: false, error: "Login code has expired" };
  }

  // Check if code was already used
  if (codeData.used) {
    return { valid: false, error: "Login code already used" };
  }

  // Mark code as used
  await updateDoc(codeRef, { used: true });

  return {
    valid: true,
    telegramId: codeData.telegramId,
    code: codeData.code,
  };
}

export async function getOrCreateUser(telegramId: string): Promise<UserDoc> {
  const userRef = doc(db, "users", telegramId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserDoc;
  }

  // Create new user with default funds
  const newUser: UserDoc = {
    userId: telegramId,
    funds: DEFAULT_NEW_USER_FUNDS,
    createdAt: new Date(),
  };

  await setDoc(userRef, newUser);
  return newUser;
}

export function generateAuthToken(telegramId: string) {
  return jwt.sign({ telegramId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { telegramId: string };
  } catch (err) {
    return null;
  }
}
