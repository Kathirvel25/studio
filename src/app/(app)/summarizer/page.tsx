import { SummarizerClient } from "@/components/summarizer-client";

export default function SummarizerPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Document Summarizer</h2>
      </div>
      <p className="text-muted-foreground">
        Upload a text document to get a concise summary.
      </p>
      <SummarizerClient />
    </div>
  );
}
