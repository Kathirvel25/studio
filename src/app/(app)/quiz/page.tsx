import { QuizClient } from "@/components/quiz-client";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function QuizPage() {
  const image = PlaceHolderImages.find(p => p.id === 'quiz-hero');
  return (
    <div className="space-y-4 p-4 md:p-8">
       {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl mb-6">
            <Image 
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Test Your Knowledge</h2>
                <p className="text-lg text-white/90 mt-2 drop-shadow-sm">
                  Generate a quiz from notes, images, or any topic to challenge yourself.
                </p>
            </div>
        </div>
      )}
      <QuizClient />
    </div>
  );
}
