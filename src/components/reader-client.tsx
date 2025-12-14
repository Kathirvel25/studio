"use client";

import { useState } from "react";
import { Loader2, BookHeadphones } from "lucide-react";
import { generateAudio } from "@/app/(app)/reader/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export function ReaderClient() {
  const [textContent, setTextContent] = useState("");
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!textContent) {
      toast({
        variant: "destructive",
        title: "No text provided",
        description: "Please paste some text to read aloud.",
      });
      return;
    }

    setIsLoading(true);
    setAudioDataUri(null);

    try {
      const result = await generateAudio(textContent);
      if (result?.media) {
        setAudioDataUri(result.media);
      } else {
        throw new Error("Failed to generate audio.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not generate audio. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Text</CardTitle>
          <CardDescription>
            Paste the text you want to hear.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your study notes, an article, or any text here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="h-64"
          />
          <Button onClick={handleGenerateAudio} disabled={isLoading || !textContent} className="mt-4 w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BookHeadphones className="mr-2 h-4 w-4" />
            )}
            Read Aloud
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Audio Player</CardTitle>
          <CardDescription>
            Listen to the generated audio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p>Generating audio...</p>
            </div>
          ) : audioDataUri ? (
            <>
                <audio controls src={audioDataUri} className="w-full">
                    Your browser does not support the audio element.
                </audio>
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap font-body h-64 overflow-auto border rounded-md p-4 w-full">
                    {textContent}
                </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <BookHeadphones className="mx-auto h-12 w-12" />
              <p className="mt-4">Your audio player will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
