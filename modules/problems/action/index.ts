"use server";
import { db } from "@/lib/db";
import {
  getLanguageName,
  pollBatchResults,
  submitBatchToJudge0,
} from "@/lib/judge0";
import { currentUser } from "@clerk/nextjs/server";
import { ca } from "date-fns/locale";
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

export async function executeCode(
  sourceCode: string,
  languageId: string,
  problemId: string,
  stdInput: string,
  expectedOutput: string
) {
  const user = await currentUser();
  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user?.id,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  if (
    !Array.isArray(stdInput) ||
    stdInput.length === 0 ||
    !Array.isArray(expectedOutput) ||
    expectedOutput.length !== stdInput.length
  ) {
    return { success: false, error: "Invalid test cases" };
  }

  const submissions = stdInput.map((input) => ({
    language_id: languageId,
    source_code: sourceCode,
    stdin: input,
    expected_output: expectedOutput,
    base64_encoded: false,
    wait: false,
  }));

  const submissionResult = await submitBatchToJudge0(submissions);

  const tokens = submissionResult.map((result: any) => result.token);

  const result = await pollBatchResults(tokens);

  let allpass = true;

  const detailedResults = result.map((result: any, index: number) => {
    const stdout = result?.stdout?.trim() || null;
    const expected_output = expectedOutput[index]?.trim();
    const passed = stdout === expected_output;

    if (!passed) {
      allpass = false;
    }

    return {
      testCase: index + 1,
      stdout,
      expected: expected_output,
      passed,
      stderr: result?.stderr || null,
      compile_output: result?.compile_output || null,
      status: result?.status?.description || null,
      time: result?.time ? `${result.time} s` : undefined,
      memory: result?.memory ? `${result.memory} KB` : undefined,
    };
  });

  const submission = await db.submission.create({
    data: {
      userId: dbUser.id,
      problemId: problemId,
      sourceCode: sourceCode,
      language: getLanguageName(languageId),
      stdin: stdInput.join("\n"),
      stdout: JSON.stringify(
        detailedResults?.map((result: any) => result.stdout)
      ),
      stderr: detailedResults?.some((result: any) => result.stderr)
        ? JSON.stringify(detailedResults?.map((result: any) => result.stderr))
        : null,
      compileOutput: detailedResults?.some(
        (result: any) => result.compile_output
      )
        ? JSON.stringify(
            detailedResults?.map((result: any) => result.compile_output)
          )
        : null,
      status: allpass ? "Accepted" : "Wrong Answer",
      memoryUsed: detailedResults?.some((result: any) => result.memory)
        ? JSON.stringify(detailedResults?.map((result: any) => result.memory))
        : null,
      timeTaken: detailedResults?.some((result: any) => result.time)
        ? JSON.stringify(detailedResults?.map((result: any) => result.time))
        : null,
    },
  });

  if (allpass) {
    await db.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId: dbUser.id,
          problemId: problemId,
        },
      },
      create: {
        userId: dbUser.id,
        problemId: problemId,
        createdAt: "",
      },
      update: {},
    });
  }

  const testCaseResults = detailedResults?.map((result: any) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    stdout: result.stdout,
    expected: result.expected,
    passed: result.passed,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    time: result.time,
    memory: result.memory,
  }));

  await db.testCaseResult.createMany({
    data: testCaseResults,
  });

  const submissionWithTestCases = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testCases: true,
    },
  });
  return { success: true, data: submissionWithTestCases };
}

export async function getAllSubmissionByProblemId(problemId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userId = await db.user.findUnique({
      where: {
        clerkId: user?.id,
      },
      select: {
        id: true,
      },
    });

    const submissions = await db.submission.findMany({
      where: {
        problemId: problemId,
        userId: userId?.id,
      },
    });

    return { success: true, data: submissions };
  } catch (error) {}
}
