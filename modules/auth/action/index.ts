"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { ca } from "date-fns/locale";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const { id, emailAddresses, firstName, lastName, imageUrl } = user;

    const newUser = await db.user.upsert({
      where: { clerkId: id },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        email: emailAddresses[0]?.emailAddress || "",
        imageUrl: imageUrl || "",
      },
      create: {
        clerkId: id,
        firstName: firstName || "",
        lastName: lastName || "",
        email: emailAddresses[0]?.emailAddress || "",
        imageUrl: imageUrl || "",
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onboarded successfully",
    };
  } catch (error) {
    console.log("[ONBOARD_USER_ERROR]", error);
    return {
      success: false,
      error: "Failed to onboard user",
    };
  }
};

export const currentUserRole = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const { id } = user;

    const dbUser = await db.user.findUnique({
      where: { clerkId: id },
      select: { role: true },
    });

    return {
      success: true,
      role: dbUser?.role || "USER",
    };
  } catch (error) {
    console.log("[CURRENT_USER_ROLE_ERROR]", error);
    return {
      success: false,
      error: "Failed to fetch user role",
    };
  }
};

export const getCurrentUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const { id } = user;

  const dbUser = await db.user.findUnique({
    where: { clerkId: id },
    select: { id: true },
  });

  return dbUser;
};
