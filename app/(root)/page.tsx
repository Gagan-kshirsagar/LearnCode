import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/action";
import { Activity, Cloud, Code2, ShieldCheck, Users, Zap } from "lucide-react";

export default async function Home() {
  await onBoardUser();

  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Developer Friendly",
      description:
        "Easily integrate with our API and SDKs to build custom applications and workflows.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Secure by Design",
      description:
        "Built with security in mind, ensuring your data and applications are protected.",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Scalable Infrastructure",
      description:
        "Leverage our cloud infrastructure to scale your applications seamlessly.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description:
        "Experience fast and reliable performance for all your applications.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaborative Tools",
      description:
        "Work together with your team using our built-in collaboration features.",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-time Analytics",
      description:
        "Gain insights with real-time analytics and reporting tools.",
    },
  ];

  return (
    <div>
      <section className="py-24 bg-liner-to-r from-amber-600 to-amber-300 dark:form-amber-600 dark:to-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
            Ready to start building with OurPlatform?
          </h2>
          <p className="text-xl text-black dark:text-white/90 mb-8">
            Join thousands of developers and businesses using OurPlatform to
            create amazing applications.
          </p>
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}
