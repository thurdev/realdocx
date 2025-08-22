import { AuthGoogleRequest } from "./auth";
import { hashPassword } from "@/helpers/auth";
import prisma from "~/lib/prisma";
import { customerAuth } from "~/server/utils/stripe";
import { sendEmail } from "~/server/utils/email";

export default defineEventHandler(async (event) => {
  const { email, email_verified, name, picture, credential } =
    await readBody<AuthGoogleRequest>(event);

  // Check if user exists
  let user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  let isNewUser = false;

  // If user does not exist
  if (!user) {
    // Create a new user
    user = await prisma.users.create({
      data: {
        email,
        password: await hashPassword(credential),
        name,
        picture,
        isEmailVerified: email_verified,
      },
    });
    isNewUser = true;
  } else {
    // update image
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        picture: user.picture,
      },
    });
  }

  const customer = await customerAuth({
    email: user.email,
    name: user.name ?? user.email.split("@")[0],
    stripeCustomerId: user.stripeCustomerId,
  });

  if (customer.id) {
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  // Send welcome email only for new users
  if (isNewUser) {
    try {
      await sendEmail(
        "welcome",
        user.email,
        user.name || user.email.split("@")[0],
        {},
        "pt"
      );
    } catch (error) {
      console.error("Failed to send welcome email for Google user:", error);
      // Don't fail authentication if email fails
    }
  }

  await setUserSession(event, {
    // User data
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      picture:
        user.picture ??
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    // Private data accessible only on server/ routes
    secure: {
      userId: user.id,
      stripeCustomerId: customer.id as string,
    },
    // Any extra fields for the session data
    loggedInAt: new Date(),
  });

  return new Response("endpoints.success.userAuthenticated", {
    status: 201,
  });
});
