import { AuthPostRequest } from "./auth";
import { hashPassword } from "@/helpers/auth";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<AuthPostRequest>(event);

  // Validate email and password
  if (!email || !password) {
    return new Response("endpoints.errors.register.missingFields", {
      status: 400,
    });
  }

  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  // If user exists, throw an error
  if (existingUser) {
    return new Response("endpoints.errors.register.userExists", {
      status: 400,
    });
  }

  // Create user
  await prisma.users.create({
    data: {
      email,
      // Hash the password before storing it
      password: await hashPassword(password),
      name: email.split("@")[0],
    },
  });

  // Return success
  return new Response("endpoints.success.userRegistered", {
    status: 201,
  });
});
