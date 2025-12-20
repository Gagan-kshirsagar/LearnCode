"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
const problemSchema = z.object({
  // Define your problem schema here
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z
    .array(z.object({ value: z.string() }))
    .min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Example input is required"),
      output: z.string().min(1, "Example output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Example input is required"),
      output: z.string().min(1, "Example output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Example input is required"),
      output: z.string().min(1, "Example output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "Code snippet is required"),
    PYTHON: z.string().min(1, "Code snippet is required"),
    CPP: z.string().min(1, "Code snippet is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "Reference solution is required"),
    PYTHON: z.string().min(1, "Reference solution is required"),
    CPP: z.string().min(1, "Reference solution is required"),
  }),
});

const sampleData = {
  title: "Palindrome Checker",
  description:
    "Check if a given string is a palindrome, considering only alphanumeric characters and ignoring cases.",
  difficulty: "EASY",
  tags: ["strings", "two-pointers"],
  constraints: "1 <= s.length <= 2 * 10^5",
  hints: "Use two pointers to compare characters from both ends of the string.",
  editorial:
    "To check if a string is a palindrome, we can use two pointers starting from the beginning and end of the string, moving towards the center while skipping non-alphanumeric characters and comparing characters in a case-insensitive manner.",
  testCases: [
    { input: '"A man, a plan, a canal: Panama"', output: "true" },
    { input: '"race a car"', output: "false" },
    { input: '" "', output: "true" },
  ],
  examples: {
    JAVASCRIPT: {
      input: '"A man, a plan, a canal: Panama"',
      output: "true",
      explanation:
        "After removing non-alphanumeric characters and ignoring cases, the string becomes 'amanaplanacanalpanama', which is a palindrome.",
    },
    PYTHON: {
      input: '"race a car"',
      output: "false",
      explanation:
        "After processing, the string becomes 'raceacar', which is not a palindrome.",
    },
    CPP: {
      input: '" "',
      output: "true",
      explanation: "An empty string is considered a palindrome.",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `
    // JavaScript code snippet
    function checkPalindrome(s) {
    //   // Your code here
    // }
    // Parse input and execute
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let inputData = '';

    rl.on('line', (input) => {
      inputData += input;
    });

    rl.on('close', () => {
      const result = checkPalindrome(inputData.trim());
      console.log(result);
    });
    `,
    PYTHON: `
    // Python code snippet
    def checkPalindrome(s):
    //   # Your code here
    // Parse input and execute
    if __name__ == "__main__":
        import sys
        input_data = sys.stdin.read().strip()
        result = checkPalindrome(input_data)
        print(result)
      `,
    CPP: `
    // C++ code snippet
    bool checkPalindrome(string s) {
     // Your code here
    }
     // Parse input and execute
    #include <iostream>
    #include <string>
    using namespace std;

    int main() {
        string input;
        getline(cin, input);
        bool result = checkPalindrome(input);
        cout << (result ? "true" : "false") << endl;
        return 0;
    }`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function isPalindrome(s) {
  let filtered = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let reversed = filtered.split('').reverse().join('');
  return filtered === reversed;
}`,
    PYTHON: `def is_palindrome(s):
    filtered = ''.join(c.lower() for c in s if c.isalnum())
    return filtered == filtered[::-1]`,
    CPP: `bool isPalindrome(string s) {
    string filtered;
    for (char c : s) {
        if (isalnum(c)) {
            filtered += tolower(c);
        }
    }
    string reversed = filtered;
    reverse(reversed.begin(), reversed.end());
    return filtered == reversed;
}`,
  },
};

const sampleHeightValueData = {
  title: "Find Maximum Subarray",
  description:
    "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
  difficulty: "MEDIUM",
  tags: ["arrays", "divide-and-conquer"],
  constraints: "1 <= nums.length <= 10^5",
  hints:
    "Use Kadane's algorithm to find the maximum subarray sum in O(n) time.",
  editorial:
    "Kadane's algorithm works by iterating through the array while keeping track of the current subarray sum and updating the maximum sum found so far.",
  testCases: [
    { input: "[−2,1,−3,4,−1,2,1,−5,4]", output: "6" },
    { input: "[1]", output: "1" },
    { input: "[5,4,−1,7,8]", output: "23" },
  ],
  examples: {
    JAVASCRIPT: {
      input: "[−2,1,−3,4,−1,2,1,−5,4]",
      output: "6",
      explanation:
        "The contiguous subarray [4,−1,2,1] has the largest sum = 6.",
    },
    PYTHON: {
      input: "[1]",
      output: "1",
      explanation: "The only element is the maximum subarray.",
    },
    CPP: {
      input: "[5,4,−1,7,8]",
      output: "23",
      explanation:
        "The contiguous subarray [5,4,−1,7,8] has the largest sum = 23.",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `function maxSubArray(nums) {
    // Your code here
    }
    // Parse input and execute
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let inputData = '';

    rl.on('line', (input) => {
      inputData += input;
    });

    rl.on('close', () => {
      const nums = JSON.parse(inputData.trim());
      const result = maxSubArray(nums);
      console.log(result);
    });
    `,
    PYTHON: `def max_sub_array(nums):
    # Your code here
    if __name__ == "__main__":
        import sys
        input_data = sys.stdin.read().strip()
        nums = json.loads(input_data)
        result = max_sub_array(nums)
        print(result)
      `,
    CPP: `int maxSubArray(vector<int>& nums) {
     // Your code here
    }
     // Parse input and execute
    #include <iostream>
    #include <vector>
    #include <string>
    #include <sstream>
    using namespace std;

    int main() {
        string input;
        getline(cin, input);
        // Assuming input is a JSON array of integers
        vector<int> nums;
        // Parse input into nums vector
        int result = maxSubArray(nums);
        cout << result << endl;
        return 0;
    }`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}`,
    PYTHON: `def max_sub_array(nums):
    max_so_far = nums[0]
    max_ending_here = nums[0]
    for num in nums[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far`,
    CPP: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
  },
};

const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
}: {
  value: string;
  onChange: () => void;
  language: string;
}) => {
  const languageMap = {
    javascript: "javascript",
    python: "python",
    cpp: "cpp",
  };
  return (
    <div className="border rounded-md bg-slate-950 text-slate-50">
      <div className="px-4 py-2 bg-slate-800 border-b font-mono text-sm">
        {language}
      </div>
      <div className="h-[300px] w-full">
        <Editor
          height="300px"
          defaultLanguage={languageMap[language as keyof typeof languageMap]}
          value={value}
          theme="vs-dark"
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 18,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

const CreateProblemForm = () => {
  const router = useRouter();

  const [sampleType, setSampleType] = useState("DP");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [{ value: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        CPP: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "",
        PYTHON: "",
        CPP: "",
      },
      referenceSolutions: {
        JAVASCRIPT: "",
        PYTHON: "",
        CPP: "",
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = form;

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/createProblem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      toast.success("Problem created successfully");
      router.push("/problems");
    } catch {
      toast.error("Failed to create problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {};

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card className="shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-3xl flex items-center gap-3">
                <FileText className="w-8 h-8 text-amber-600" /> Create New
                Problem
              </CardTitle>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex border rounded-md">
                  <Button
                    type="button"
                    variant={sampleType === "DP" ? "default" : "outline"}
                    size={"sm"}
                    onClick={() => setSampleType("DP")}
                  >
                    DP Problem
                  </Button>
                  <Button
                    type="button"
                    variant={sampleType === "String" ? "default" : "outline"}
                    size={"sm"}
                    onClick={() => setSampleType("String")}
                  >
                    String Problem
                  </Button>
                </div>
                <Button
                  type="button"
                  variant={"secondary"}
                  size={"sm"}
                  onClick={loadSampleData}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Load Sample
                </Button>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label className="text-lg font-semibold">Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter problem title"
                    className="mt-2"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-lg font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter problem description"
                    className="mt-2 w-full h-32 p-2 border rounded-md"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label className="text-lg font-semibold">Difficulty</Label>
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }: any) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">
                            <Badge
                              variant={"secondary"}
                              className="bg-green-100 text-green-800"
                            >
                              Easy
                            </Badge>
                          </SelectItem>
                          <SelectItem value="Medium">
                            <Badge
                              variant={"secondary"}
                              className="bg-amber-100 text-amber-800"
                            >
                              Medium
                            </Badge>
                          </SelectItem>
                          <SelectItem value="Hard">
                            <Badge
                              variant={"secondary"}
                              className="bg-red-100 text-red-800"
                            >
                              Hard
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.difficulty && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.difficulty.message as string}
                    </p>
                  )}
                </div>
              </div>
              <Card className="bg-amber-50 dark:bg-amber-950/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-slate-600" />
                      Tags
                    </CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => appendTag({ value: "" })}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Tag
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tagFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          id={`tags.${index}.value`}
                          {...register(`tags.${index}.value` as const)}
                          placeholder="Enter tag"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(index)}
                          disabled={tagFields.length === 1}
                          className="p-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.tags.message as string}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-slate-600" />
                      Test Cases
                    </CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => appendTestCase({ input: "", output: "" })}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Test Case
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {testCaseFields.map((field, index) => (
                      <Card key={field.id} className="bg-background">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Test Case #{index + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTestCase(index)}
                              disabled={testCaseFields.length === 1}
                              className="text-red-500 gap-2"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-md font-semibold">
                                Input
                              </Label>
                              <Textarea
                                id={`testCases.${index}.input`}
                                {...register(
                                  `testCases.${index}.input` as const
                                )}
                                placeholder="Enter test case input"
                                className="mt-2 min-h-24 resize-y font-mono"
                              />
                              {errors.testCases &&
                                errors.testCases[index] &&
                                errors.testCases[index]?.input && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      errors.testCases[index]?.input
                                        ?.message as string
                                    }
                                  </p>
                                )}
                            </div>
                            <div>
                              <Label className="text-md font-semibold">
                                Output
                              </Label>
                              <Textarea
                                id={`testCases.${index}.output`}
                                {...register(
                                  `testCases.${index}.output` as const
                                )}
                                placeholder="Enter test case output"
                                className="mt-2 min-h-24 resize-y font-mono"
                              />
                              {errors.testCases &&
                                errors.testCases[index] &&
                                errors.testCases[index]?.output && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      errors.testCases[index]?.output
                                        ?.message as string
                                    }
                                  </p>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {errors.testCases &&
                      typeof errors.testCases.message === "string" && (
                        <p className="text-sm text-red-500">
                          {errors.testCases.message as string}
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>

              {["JAVASCRIPT", "PYTHON", "CPP"].map((language) => (
                <Card
                  key={language}
                  className="bg-slate-50 dark:bg-slate-950/20"
                >
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-slate-600" />
                      {language}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Starter Code Template
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Controller
                          name={`codeSnippets.${
                            language as "JAVASCRIPT" | "PYTHON" | "CPP"
                          }`}
                          control={control}
                          render={({ field }: { field: any }) => (
                            <CodeEditor
                              value={field.value}
                              onChange={field.onChange}
                              language={language.toLowerCase()}
                            />
                          )}
                        />
                        {errors.codeSnippets &&
                          errors.codeSnippets[
                            language as keyof typeof errors.codeSnippets
                          ] && (
                            <p className="text-sm text-red-500 mt-1">
                              {
                                (
                                  errors.codeSnippets[
                                    language as keyof typeof errors.codeSnippets
                                  ] as any
                                ).message as string
                              }
                            </p>
                          )}
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-slate-600" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="font-medium">Constraints</Label>
                    <Textarea
                      id="constraints"
                      {...register("constraints")}
                      placeholder="Enter problem constraints"
                      className="mt-2 min-h-24 resize-y font-mono"
                    />
                    {errors.constraints && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.constraints.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-medium">Hints (Optional)</Label>
                    <Textarea
                      id="hints"
                      {...register("hints")}
                      placeholder="Enter problem hints"
                      className="mt-2 min-h-24 resize-y"
                    />
                    {errors.hints && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.hints.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="font-medium">Editorial (Optional)</Label>
                    <Textarea
                      id="editorial"
                      {...register("editorial")}
                      placeholder="Enter problem editorial/solution explanation"
                      className="mt-2 min-h-24 resize-y"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? "Creating..." : "Create Problem"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateProblemForm;
