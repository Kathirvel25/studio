import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Schedule Feature Coming Soon</CardTitle>
          <CardDescription>
            This is where your smart study schedule will be displayed in a calendar view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You'll be able to see your daily and weekly tasks, drag and drop to reschedule, and get a clear overview of your study plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
