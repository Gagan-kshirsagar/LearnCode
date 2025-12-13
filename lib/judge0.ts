import axios from "axios";
export function getJudge0LanguageId(language: string): number | null {
  const languageMap: { [key: string]: number } = {
    c: 50,
    cpp: 54,
    java: 62,
    python: 71,
    javascript: 63,
    typescript: 74,
    ruby: 72,
    go: 60,
    csharp: 51,
    php: 68,
    swift: 83,
    kotlin: 78,
    rust: 73,
    scala: 81,
    haskell: 77,
    perl: 66,
    r: 80,
    dart: 82,
    // Add more languages and their corresponding IDs as needed
  };

  return languageMap[language.toLowerCase()] || null;
}

export async function submitBatchToJudge0(submissions: any[]) {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );
  return data;
}

export async function pollBatchResults(token: string) {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch?tokens=${token}&base64_encoded=false`
    );
    const allCompleted = data.submissions.every(
      (submission: any) =>
        submission.status.id === 3 ||
        submission.status.id === 4 ||
        submission.status.id === 5 ||
        submission.status.id === 6
    );
    if (allCompleted) {
      return data.submissions;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again
  }
}
