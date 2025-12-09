import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Youtube } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <Youtube className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Study Resources Coming Soon</CardTitle>
          <CardDescription>
            Find helpful videos, articles, and tools to aid your learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This section will feature AI-powered recommendations tailored to your subjects.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
