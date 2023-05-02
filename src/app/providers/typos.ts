export type SignIn = {
    email: string;
    password: string;
  }

  
 

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
  }
  
  export type FirebaseError = {
    code: string;
    message: string
  };