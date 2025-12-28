"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/modules/home/components/modeToggle";
import {
  getAllSubmissionByProblemId,
  getProblemById,
} from "@/modules/problems/action";
import SubmissionHistory from "@/modules/problems/components/SubmissionHistory";
import { Editor } from "@monaco-editor/react";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import {
  ArrowLeft,
  Code,
  FileText,
  Lightbulb,
  Loader2,
  Play,
  Send,
  Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 border-green-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Hard":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ProblemIdPage = ({ params }: any) => {
  const [problem, setProblem] = useState<any>(null);
  const [executionResponse, setExecutionResponse] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  };

  const { theme } = useTheme();

  // useEffect(() => {
  //   const fetchProblem = async () => {
  //     try {
  //       const resolvedParams = await params;
  //       const problemData = await getProblemById(resolvedParams?.id);
  //       if (problemData?.success) {
  //         setProblem(problemData?.data);
  //         setCode(
  //           (problemData?.data?.codeSnippets as Record<string, string>)?.[
  //             selectedLanguage
  //           ] || ""
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching problem:", error);
  //     }
  //   };
  //   fetchProblem();
  // }, [params]);

  // if (!problem) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <Loader2 className="animate-spin size-5 text-amber-400" />
  //     </div>
  //   );
  // }

  // useEffect(() => {
  //   const fetchSubmissionHistory = async () => {
  //     try {
  //       const resolvedParams = await params;
  //       const submissionHistory = await getAllSubmissionByProblemId(
  //         resolvedParams?.id
  //       );
  //       if (submissionHistory?.success) {
  //         setExecutionResponse(submissionHistory?.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching submission history:", error);
  //     }
  //   };
  //   fetchSubmissionHistory();
  // }, [params]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft />
                </Button>
                <h1 className="text-3xl font-bold">{problem?.title}</h1>
                <Badge>{problem?.difficulty}</Badge>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem?.tags?.map((tag: any) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ModeToggle />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-foreground leading-relaxed">
                    {problem?.description}
                  </p>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Example:</h3>
                    {problem?.examples[selectedLanguage] && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div>
                          <span className="font-medium text-amber-400">
                            Input:
                          </span>
                          <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                            {problem?.examples[selectedLanguage].input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Explanation:</span>
                          <span className="text-sm">
                            {problem?.examples[selectedLanguage].explanation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Constraints:</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {problem?.constraints}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Tabs defaultValue="submissions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Submissions
                    </TabsTrigger>
                    <TabsTrigger
                      value="editorial"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Editorial
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="submissions" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <SubmissionHistory submissions={[]} />
                    </div>
                  </TabsContent>
                  <TabsContent value="editorial" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem?.editorial
                        ? problem?.editorial
                        : "Editorial not available."}
                    </div>
                  </TabsContent>
                  <TabsContent value="hints" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem?.hints ? problem?.hints : "Hints not available."}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                      <SelectItem value="PYTHON">Python</SelectItem>
                      <SelectItem value="C++">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-rounded-lg overflow-hidden">
                  <Editor
                    height={"400px"}
                    language={
                      selectedLanguage.toLowerCase() === "javascript"
                        ? "javascript"
                        : selectedLanguage.toLowerCase()
                    }
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleRun}
                    disabled={isRunning}
                    variant={"outline"}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>
                  Run your code against these test cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-4">
                    {problem?.testCases?.map((testCase: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">
                          Test Case {index + 1}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Input:
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase.input}
                            </code>
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Expected:
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase?.output}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            {executionResponse && executionResponse.submission && (
              <div className="space-y-4 mt-4"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
