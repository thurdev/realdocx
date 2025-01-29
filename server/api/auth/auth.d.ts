export type AuthPostRequest = {
  email: string;
  password: string;
};

export type AuthGoogleRequest = {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  credential: string;
};
