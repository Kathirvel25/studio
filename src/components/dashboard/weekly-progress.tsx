import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeeklyProgressProps = {
  progress: {
    completed: number;
    total: number;
  };
};

export function WeeklyProgress({ progress }: WeeklyProgressProps) {
  const percentage =
    progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
        <CardDescription>
          You've completed {progress.completed} of {progress.total} tasks this week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
        <Progress value={percentage} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}
