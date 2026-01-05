import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function ResourcesPage() {
  const image = PlaceHolderImages.find(p => p.id === 'resources-hero');

  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
      <Card className="overflow-hidden">
        {image && (
          <div className="relative h-64 w-full">
            <Image 
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <div className="p-6">
          <CardHeader className="p-0">
            <CardTitle>Study Resources Coming Soon</CardTitle>
            <CardDescription className="pt-2">
              Find helpful videos, articles, and tools to aid your learning.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <p className="text-sm text-muted-foreground">
              This section will feature AI-powered recommendations tailored to your subjects.
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
