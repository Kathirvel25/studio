"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Youtube, Loader2 } from "lucide-react";
import { suggestVideos } from "@/app/(app)/resources/actions";
import type { SuggestVideosOutput } from "@/ai/flows/suggest-videos";
import { useToast } from "@/hooks/use-toast";

type SuggestedVideosProps = {
  subjects: string[];
};

export function SuggestedVideos({ subjects }: SuggestedVideosProps) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || "");
  const [suggestions, setSuggestions] = useState<SuggestVideosOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedSubject) {
      fetchSuggestions();
    }
  }, [selectedSubject]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestVideos({ subject: selectedSubject });
      if (result) {
        setSuggestions(result);
      } else {
        throw new Error("Failed to get video suggestions.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not fetch video suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Suggested Videos</CardTitle>
          <Youtube className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>
          AI-powered video recommendations for your subjects.
        </CardDescription>
        <div className="pt-2">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions?.videos.map((video, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    from {video.channel}
                  </p>
                  <p className="text-sm mt-1">{video.reason}</p>
                </div>
              </div>
            ))}
            {!suggestions && !isLoading && (
                 <p className="text-sm text-muted-foreground text-center h-40 flex items-center justify-center">
                    Select a subject to see video recommendations.
                </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
