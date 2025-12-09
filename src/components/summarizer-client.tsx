"use client";

import { useState } from "react";
import { Loader2, FileText, Upload, BrainCircuit } from "lucide-react";
import { summarizeDocument } from "@/app/(app)/summarizer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function SummarizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/plain") {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .txt file.",
        });
        setFile(null);
      }
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to summarize.",
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) {
        toast({
          variant: "destructive",
          title: "Empty file",
          description: "The selected file is empty.",
        });
        setIsLoading(false);
        return;
      }

      try {
        const result = await summarizeDocument({ documentContent: content });
        if (result) {
          setSummary(result.summary);
        } else {
          throw new Error("Failed to get summary.");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Could not generate summary. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File read error",
            description: "Could not read the selected file.",
          });
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <Input type="file" accept=".txt" onChange={handleFileChange} className="max-w-sm"/>
          </div>
          {file && (
            <div className="text-sm text-muted-foreground">
              Selected file: {file.name}
            </div>
          )}
          <Button onClick={handleSummarize} disabled={isLoading || !file}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Summarize
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p>Generating summary...</p>
            </div>
          ) : summary ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap font-body">
              {summary}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
              <p className="mt-4">Your document summary will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
