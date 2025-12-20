import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/generated/prisma";
import { currentUserRole } from "@/modules/auth/action";
import { ModeToggle } from "@/modules/home/components/modeToggle";
import CreateProblemForm from "@/modules/problems/components/CreateProblemForm";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const CreateProblem = async () => {
  const user = await currentUser();
  const { role } = await currentUserRole();

  if (role !== UserRole.ADMIN) {
    return redirect("/");
  }
  return (
    <>
      <section className="flex flex-col items-center justify-center mx-4 my-4">
        <div className="flex flex-row justify-between items-center w-full">
          <Link href={"/"}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-amber-400">
            Welcome
            {user?.firstName} Create Problem
          </h1>
          <ModeToggle />
        </div>
        <CreateProblemForm />
      </section>
    </>
  );
};

export default CreateProblem;
