import { ReaderClient } from "@/components/reader-client";

export default function ReaderPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">StudyReader AI</h2>
      </div>
      <p className="text-muted-foreground">
        Paste any text below and have it read aloud to you by our AI assistant.
      </p>
      <ReaderClient />
    </div>
  );
}
