// api/funds
import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/database/firebase_config";

// Function to check if a user exists in Firestore
const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", userId); // Create a reference to the user document
    const userDoc = await getDoc(userDocRef); // Fetch the document

    return userDoc.exists(); // Return true if the document exists
  } catch (error) {
    console.error("Error in checkUserExists function:", error);
    return false;
  }
};

// Function to create a new user document in Firestore
const createUserDocument = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId); // Create a reference to the user document
    const newUserData = {
      userId,
      funds: 0,
      createdAt: new Date(),
    };

    await setDoc(userDocRef, newUserData); // Create the document with the new data
  } catch (error) {
    console.error("Error in createUserDocument function:", error);
    throw error; // Re-throw the error to handle it in the POST function
  }
};

// POST API route handler
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = await request.json();


    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const userExists = await checkUserExists(userId);

    if (userExists) {
      // Fetch the existing user data
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      return NextResponse.json({ user: userDoc.data() });
    } else {
      // Create a new user document if the user does not exist
      await createUserDocument(userId);

      // Fetch the newly created user data
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      return NextResponse.json({ user: userDoc.data() });
    }
  } catch (error) {
    console.error("Error in POST API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
