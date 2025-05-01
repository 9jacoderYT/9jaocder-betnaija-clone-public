import { NextRequest, NextResponse } from "next/server";
import { validateLoginCode, generateAuthToken } from "@/lib/database/auth";
import { Telegraf } from "telegraf";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/database/firebase_config";

// Function to check if a user exists in Firestore
const checkUserFunds = async (userId: string): Promise<number> => {
  try {
    const userDocRef = doc(db, "users", userId); // Create a reference to the user document
    const userDoc = await getDoc(userDocRef); // Fetch the document

    if (!userDoc.exists()) return 0;

    const userData = userDoc.data();

    return userData.funds; // Return true if the document exists
  } catch (error) {
    console.error("Error in checkUserExists function:", error);
    return 0;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Login code is required" },
        { status: 400 }
      );
    }

    // Validate the login code
    const validation = await validateLoginCode(code);
    console.log(validation);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 401 });
    }

    // Get user info from Telegram
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
    const chat = await bot.telegram.getChat(validation.telegramId);
    const username =
      chat && "username" in chat && chat.username ? chat.username : null;

    if (!username) {
      return NextResponse.json(
        { error: "Could not retrieve Telegram username" },
        { status: 401 }
      );
    }

    let userFunds = 0;

    // Fetch or create user funds document
    const userFundsExists = await checkUserFunds(validation.telegramId);
    if (userFundsExists) {
      userFunds = userFundsExists;
    }

    // Generate JWT token
    const token = generateAuthToken(validation.telegramId);

    return NextResponse.json({
      token,
      username,
      telegramId: validation.telegramId,
      funds: userFunds,
      status: 200,
      error: false,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: true, status: 500 });
  }
}
