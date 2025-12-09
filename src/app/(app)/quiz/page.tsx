import { QuizClient } from "@/components/quiz-client";

export default function QuizPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Test Your Knowledge</h2>
      </div>
      <p className="text-muted-foreground">
        Upload a document you've studied to generate a quiz and test your comprehension.
      </p>
      <QuizClient />
    </div>
  );
}
