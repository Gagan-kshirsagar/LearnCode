import db from "@/lib/db";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatchToJudge0,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUser } from "@/modules/auth/action";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { success, role } = await currentUserRole();
    const user = await getCurrentUser();

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      example,
      constraints,
      testCases,
      codeSnippets,
      referenceSolution,
    } = body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolution
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "Text cases must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!referenceSolution || typeof referenceSolution !== "object") {
      return NextResponse.json(
        { error: "Reference solutions must be a non-empty object" },
        { status: 400 }
      );
    }

    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);
      if (typeof solutionCode !== "string" || solutionCode.trim() === "") {
        return NextResponse.json(
          {
            error: `Reference solution for ${language} must be a non-empty string`,
          },
          { status: 400 }
        );
      }
      if (!languageId) {
        return NextResponse.json(
          { error: `Unsupported programming language: ${language}` },
          { status: 400 }
        );
      }

      const submission = testCases?.map((input, output) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
        cpu_time_limit: 2,
        memory_limit: 128000,
      }));

      const submissionResult = await submitBatchToJudge0(submission);

      const tokens = submissionResult.map((result: any) => result.token);

      const result = await pollBatchResults(tokens);

      for (let res of result) {
        if (res.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Reference solution for ${language} failed on some test cases`,
              testCase: {
                input: submission[result.indexOf(res)].stdin,
                expectedOutput: submission[result.indexOf(res)].expected_output,
                actualOutput: res.stdout,
                error: res.stderr || res.compile_output,
              },
              details: res,
            },
            { status: 400 }
          );
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        example,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
        userId: user?.id || "",
      },
    });

    return NextResponse.json(
      { message: "Problem created successfully", problem: newProblem },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong save problem to database" },
      { status: 500 }
    );
  }
}
