import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  return {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  };
});
