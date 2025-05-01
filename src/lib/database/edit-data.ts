import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase_config";

export const addFunds = async (userId: string, amount: number) => {
  try {
    // first find the user details on the site
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDoc.exists()) {
      console.error("User document does not exist for userId:", userId);
      return false;
    }

    // Get the current data
    const data = userDoc.data();

    // Ensure funds exists and is a number, default to 0 if undefined
    const currentFunds = Number(data.funds) || 0;
    const amountToAdd = Number(amount);

    // Validate the amount
    if (isNaN(amountToAdd) || amountToAdd < 0) {
      console.error("Invalid amount provided:", amount);
      return false;
    }

    // Calculate the new total
    const newAmount = currentFunds + amountToAdd;

    // Update the document in Firestore with the new funds value
    await updateDoc(userDocRef, {
      funds: newAmount,
    });

    console.log("Funds updated successfully for userId:", userId);
    return { errorbol: false, newfunds: newAmount };
  } catch (error) {
    console.error("Error adding funds:", error);
    return { errorbol: true, newfunds: 0 };
  }
};

export const addBet = async (betObject) => {
  try {
    const { userId, betAmount } = betObject;
    console.log(userId, betAmount);

    // First check if the user has enough funds
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    // Check if the user exists
    if (!userDoc.exists()) {
      console.error("User document does not exist for userId:", userId);
      return { error: true, message: "User not found" };
    }

    // Get current funds
    const userData = userDoc.data();
    const currentFunds = Number(userData.funds) || 0;
    const betAmountNum = Number(betAmount);

    // Validate bet amount
    if (isNaN(betAmountNum) || betAmountNum <= 0) {
      console.error("Invalid bet amount:", betAmount);
      return { error: true, message: "Invalid bet amount" };
    }

    // Check if user has enough funds
    if (currentFunds < betAmountNum) {
      console.error(
        "Insufficient funds. Current:",
        currentFunds,
        "Required:",
        betAmountNum
      );
      return { error: true, message: "Insufficient funds" };
    }

    // Calculate new balance after deducting bet amount
    const newBalance = currentFunds - betAmountNum;

    // Update the user's funds
    await updateDoc(userDocRef, {
      funds: newBalance,
    });

    // Add timestamp to bet object
    const betWithTimestamp = {
      ...betObject,
      createdAt: new Date(),
      status: "pending", // You might want to track bet status
    };

    // Add the bet to the bets collection
    const betsCollectionRef = collection(db, "bets");
    const betDocRef = await addDoc(betsCollectionRef, betWithTimestamp);

    console.log("Bet placed successfully with ID:", betDocRef.id);

    return {
      error: false,
      message: "Bet placed successfully",
      betId: betDocRef.id,
      newBalance: newBalance,
    };
  } catch (error) {
    console.error("Error adding Bet:", error);
    return { error: true, message: "Error processing bet" };
  }
};

export const fetchBets = async (userId: string) => {
  try {
    // Create a reference to the bets collection
    const betsCollectionRef = collection(db, "bets");

    // Create a query against the collection to find bets with matching userId
    const q = query(betsCollectionRef, where("userId", "==", userId));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Create an array to store the results
    const userBets = [];

    // Iterate through the query results
    querySnapshot.forEach((doc) => {
      // Add each bet to the array, including the document ID
      userBets.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`Retrieved ${userBets.length} bets for user: ${userId}`);
    return { error: false, bets: userBets };
  } catch (error) {
    console.error("Error fetching bets:", error);
    return { error: true, bets: [] };
  }
};


export const fetchBetById = async (betId: string) => {
  try {
    // Create a reference to the specific bet document
    const betDocRef = doc(db, "bets", betId);

    // Get the document
    const betDoc = await getDoc(betDocRef);

    // Check if the document exists
    if (!betDoc.exists()) {
      console.error("Bet document does not exist for betId:", betId);
      return { error: true, message: "Bet not found", bet: null };
    }

    // Return the bet data with its ID
    const betData = {
      id: betDoc.id,
      ...betDoc.data(),
    };

    console.log(`Retrieved bet with ID: ${betId}`);
    return { error: false, bet: betData };
  } catch (error) {
    console.error("Error fetching bet:", error);
    return { error: true, message: "Error retrieving bet", bet: null };
  }
};