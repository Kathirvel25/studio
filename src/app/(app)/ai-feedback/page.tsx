import { AIFeedbackClient } from "@/components/ai-feedback-client";

export default function AIFeedbackPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Weekly Smart Feedback</h2>
      </div>
      <p className="text-muted-foreground">
        Enter your weekly study data to get personalized feedback and suggestions from our AI assistant.
      </p>
      <AIFeedbackClient />
    </div>
  );
}
