"use client";

import { useState } from "react";
import { Loader2, FileText, Upload, BrainCircuit } from "lucide-react";
import { summarizeDocument } from "@/app/(app)/summarizer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SummarizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/plain") {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = (e) => {
            setTextContent(e.target?.result as string);
        };

      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .txt file.",
        });
        setFile(null);
        setTextContent("");
      }
    }
  };

  const handleSummarize = async () => {
    if (!textContent) {
      toast({
        variant: "destructive",
        title: "No content",
        description: "Please paste text or upload a file to summarize.",
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const result = await summarizeDocument({ documentContent: textContent });
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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Content</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                    <Textarea 
                        placeholder="Paste your text here..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="h-48"
                    />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                    <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <input type="file" accept=".txt" onChange={handleFileChange} className="max-w-sm text-sm"/>
                    </div>
                    {file && (
                        <div className="mt-2 text-sm text-muted-foreground">
                        Selected file: {file.name}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            <Button onClick={handleSummarize} disabled={isLoading || !textContent} className="mt-4">
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
