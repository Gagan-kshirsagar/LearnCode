import db from "@/lib/db";
import { getAllProblems } from "@/modules/problems/action";
import ProblemsTable from "@/modules/problems/components/ProblemsTable";
import { currentUser } from "@clerk/nextjs/server";

const ProblemsPage = async () => {
  //   const user = await currentUser();
  //   let dbUser = null;
  //   if (user) {
  //     dbUser = await db.user.findUnique({
  //       where: {
  //         clerkId: user?.id,
  //       },
  //       select: {
  //         id: true,
  //         role: true,
  //       },
  //     });
  //   }

  //   const { data: problems, error } = await getAllProblems();

  const error = null;
  const problems = [{}];
  const dbUser = null;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">Error loading problems: {error}</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-32">
      <ProblemsTable problems={problems} dbUser={dbUser} />
    </div>
  );
};

export default ProblemsPage;
