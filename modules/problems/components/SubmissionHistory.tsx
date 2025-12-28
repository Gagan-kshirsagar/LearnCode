import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatMemory, formatTime } from "@/lib/contant";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Cpu,
  XCircle,
} from "lucide-react";

const SubmissionHistory = ({ submissions = [] }) => {
  if (!submissions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>No Submission yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submission History</CardTitle>
        <CardDescription>
          Your previous submissions are listed below:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {submissions?.map((submission: any) => (
              <Card key={submission.id} className="bg-muted/50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {submission.status === "Accept" ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Accepted
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                          <XCircle className="mr-1 h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Language
                        </p>
                        <p className="text-sm font-medium">
                          {submission?.language}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Memory
                        </p>
                        <p className="text-sm font-medium">
                          {formatMemory(submission?.memory)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Time
                        </p>
                        <p className="text-sm font-medium">
                          {formatTime(submission?.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SubmissionHistory;
