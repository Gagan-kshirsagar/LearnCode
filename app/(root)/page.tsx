import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onBoardUser } from "@/modules/auth/action";
import {
  Activity,
  ChevronRight,
  Cloud,
  Code2,
  Play,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";

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
    {
      icon: <Star className="h-6 w-6" />,
      title: "24/7 Support",
      description:
        "Get assistance whenever you need it with our dedicated support team.",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Global Reach",
      description:
        "Deploy your applications globally with our extensive network of data centers.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "APIs Integrated", value: "500+" },
    { label: "Uptime", value: "99.9%" },
    { label: "Countries Served", value: "50+" },
  ];

  const problemCatagories = [
    {
      level: "Beginner",
      title: "Easy Problems",
      description:
        "Perfect for those just starting out, these problems help you build a strong foundation.",
      count: "500+ Problems",
      color: "amber",
    },
    {
      level: "Intermediate",
      title: "Challenging Problems",
      description:
        "Ideal for developers with some experience, these problems will test your skills.",
      count: "300+ Problems",
      color: "blue",
    },
    {
      level: "Advanced",
      title: "Expert Problems",
      description:
        "Designed for seasoned developers, these problems will push your limits.",
      count: "200+ Problems",
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen transition-colors mt-24">
      <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-16">
        <div className="max-w-6xl mx-auto text-center">
          <Badge
            variant={"secondary"}
            className="mb-8 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            <Star className="h-4 w-4 mr-2" />
            New Feature Released!
          </Badge>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-8">
            Master
            <span className="relative inline-block">
              <span className="px-6 py-3 bg-amber-500 dark:bg-amber-400 text-white dark:text-gray-900 rounded-2xl transform -rotate-1 inline-block shadow-lg">
                Problem
              </span>
            </span>
            Solving
            <br />
            with
            <span className="relative inline-block">
              <span className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl transform rotate-1 inline-block shadow-lg">
                Code
              </span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Challenge yourself with thousands of coding problems, complete with
            developers worldwide, and accelerate you programming journey with
            solutions and detailed explanations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size={"lg"}
              className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Solving Problems
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant={"outline"}
              size="lg"
              className="border-2 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              Browse Problem
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="feature" className="py-24 bg-gray-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to
              <span className="text-amber-600 dark:text-amber-400">excel</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              OurPlatform offers a comprehensive suite of features designed to
              help you succeed in your coding journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${
                      index % 2 === 0
                        ? "bg-amber-100 dark:bg-amber-900"
                        : "bg-indigo-100 dark:bg-indigo-900"
                    } rounded-xl flex items-center justify-center ${
                      index % 2 === 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    } mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-300">
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="problems" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Problem Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore problems across various difficulty levels to enhance your
              coding skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problemCatagories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${
                      category.color === "amber"
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
                        : category.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                    } rounded-xl flex items-center justify-center mb-4`}
                  >
                    {category.level === "Beginner" && (
                      <Star className="h-6 w-6" />
                    )}
                    {category.level === "Intermediate" && (
                      <Star className="h-6 w-6" />
                    )}
                    {category.level === "Advanced" && (
                      <Star className="h-6 w-6" />
                    )}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-300">
                  <p className="mb-4">{category.description}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      category.color === "amber"
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
                        : category.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {category.count}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
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
