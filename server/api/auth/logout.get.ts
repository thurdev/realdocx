export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure) {
    return {
      error: "Unauthorized",
    };
  }

  // Clear the current user session
  await clearUserSession(event);

  return {
    success: true,
  };
});
