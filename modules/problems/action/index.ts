"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllProblems() {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const data = await db.user.findUnique({
      where: {
        clerkId: user?.id,
      },
      select: {
        id: true,
      },
    });

    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: data?.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: problems };
  } catch (error) {
    console.log("Error fetching problems:", error);
    return { success: false, error: "Failed to fetch problems" };
  }
}

export async function getProblemById(problemId: string) {
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return { success: false, data: null };
    }

    return { success: true, data: problem };
  } catch (error) {
    console.log("Error fetching problem by ID:", error);
    throw error;
  }
}

export async function deleteProblemById(problemId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const userData = await db.user.findUnique({
      where: {
        clerkId: user?.id,
      },
      select: {
        role: true,
      },
    });

    if (userData?.role !== "ADMIN") {
      throw new Error("Unauthorized action");
    }

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    revalidatePath("/problems");

    return { success: true, message: "Problem deleted successfully" };
  } catch (error) {
    console.log("Error deleting problem by ID:", error);
    throw error;
  }
}
