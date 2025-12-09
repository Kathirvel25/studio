import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BookCopy } from "lucide-react";

export default function SyllabusPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Syllabus</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <BookCopy className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Syllabus Manager Coming Soon</CardTitle>
          <CardDescription>
            Input your subjects, chapters, and topics here to break them down into manageable tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tool will help you organize your entire syllabus and automatically generate study tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
