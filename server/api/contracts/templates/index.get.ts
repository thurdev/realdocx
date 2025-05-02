import templates from "./data.json";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return {
      error: "Failed to fetch templates",
    };
  }
});
