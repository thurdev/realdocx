// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email: string;
    picture: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
    userId: number;
    stripeCustomerId: string;
  }
}

export {};
