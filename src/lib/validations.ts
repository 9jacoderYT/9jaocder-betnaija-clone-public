export function getUserIdFromLoginCode(loginCode: string): number | false {
  // Check if loginCode is a string and contains an underscore
  if (typeof loginCode !== "string" || !loginCode.includes("_")) {
    return false;
  }

  // Split the login code at the underscore
  const parts = loginCode.split("_");

  // Check if there are exactly 2 parts (userId and random digits)
  if (parts.length !== 2) {
    return false;
  }

  // Extract parts
  const userId = parts[0];
  const randomDigits = parts[1];

  // Check if both parts are numeric
  if (!/^\d+$/.test(userId) || !/^\d+$/.test(randomDigits)) {
    return false;
  }

  // Check if randomDigits is exactly 4 digits
  if (randomDigits.length !== 4) {
    return false;
  }

  // If all checks pass, return the user ID as a number
  return parseInt(userId, 10);
}
