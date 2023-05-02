import { FirebaseError } from "./typos";

export function translateFirebaseErrorMessage({code, message}: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "Wrong password.";
    }
    return message;
  }