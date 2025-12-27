"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectValue } from "@radix-ui/react-select";
import {
  Bookmark,
  Filter,
  PencilIcon,
  Plus,
  Search,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { deleteProblemById } from "../action";
import { toast } from "sonner";

const ProblemsTable = ({
  problems,
  dbUser,
}: {
  problems: any;
  dbUser: any;
}) => {
  const [isCreateModelOpen, setIsCreateModelOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("ALL");
  const [selectedTag, setSelectedTag] = React.useState("ALL");
  const difficulties = ["Easy", "Medium", "Hard"];

  const [currentPage, setCurrentPage] = useState(1);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem: any) =>
        problem.title?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem: any) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem: any) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems?.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    React.useState(false);

  const [selectedProblemId, setSelectedProblemId] = React.useState<
    string | null
  >(null);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set<string>();
    problems.forEach((problem: any) => {
      if (Array.isArray(problem.tags)) {
        problem.tags.forEach((tag: string) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [problems]);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Hard":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  const getDifficultyVariant = (level: string) => {
    switch (level) {
      case "Easy":
        return "default";
      case "Medium":
        return "secondary";
      case "Hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleDelete = async (problemId: string) => {
    // Implement delete functionality here
    const result = await deleteProblemById(problemId);
    if (result.success) {
      toast.success("Problem deleted successfully");
    } else {
      toast.error("Failed to delete problem");
    }
  };

  const handlePlaylist = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
          <p className="text-muted-foreground">
            Manage and solve your coding problems efficiently.
          </p>
        </div>
        <Button onClick={() => setIsCreateModelOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Problem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title...."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {difficulties.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  {/* Assuming tags are predefined; replace with dynamic tags if available */}
                  {["Array", "String", "Dynamic Programming", "Graph"].map(
                    (tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[120px]">Difficulty</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProblems?.length > 0 ? (
                paginatedProblems?.map((problem: any) => {
                  const isSolved = problem?.solvedBy?.length > 0;
                  return (
                    <TableRow key={problem?.id}>
                      <TableCell>
                        <Checkbox
                          checked={isSolved}
                          disabled
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/problem/${problem.id}`}
                          className="text-primary hover:underline transition-colors"
                        >
                          {problem?.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(problem?.tags || [])?.map(
                            (tag: any, index: number) => (
                              <Badge
                                variant={"outline"}
                                className="text-xs bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50"
                                key={index}
                              >
                                {tag}
                              </Badge>
                            )
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`border-0 font-medium`}>
                        <Badge>{problem?.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {dbUser?.role === "ADMIN" && (
                            <>
                              <Button
                                variant={"destructive"}
                                size="sm"
                                onClick={() => {}}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                              <Button variant={"outline"} size="sm" disabled>
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => {}}
                            className="gap-2"
                          >
                            <Bookmark className="h-4 w-4" />
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProblems?.length)} of{" "}
            {filteredProblems?.length} problems
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant={"outline"}
              size={"sm"}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsTable;
