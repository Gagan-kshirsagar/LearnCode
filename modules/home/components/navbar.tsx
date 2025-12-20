import Link from "next/link";
import React from "react";
import { ModeToggle } from "./modeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Navbar = ({ userRole }: { userRole: string }) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg:white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
        <div className="flex justify-between items-center px-6 py-4">
          <Link href={"/"} className="flex items-center gap-2"></Link>
          <div className="flex flex-row items-center justify-center gap-x-4">
            <Link
              href={"/problems"}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Problems
            </Link>
            <Link
              href={"/about"}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              About
            </Link>
            <Link
              href={"profile"}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
            >
              Profile
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              {userRole === "ADMIN" && (
                <Link href="/createProblem">
                  <Button variant={"outline"} size="default">
                    Create Problem
                  </Button>
                </Link>
              )}
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button
                    variant={"ghost"}
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:bg-white/10"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
