
import { cn } from "@/lib/utils";

type LevelBadgeProps = {
  level: number;
  className?: string;
};

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <div
      className={cn(
        "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white ring-2 ring-background",
        "bg-gradient-to-tr from-purple-500 to-indigo-600",
        className
      )}
      title={`Level ${level}`}
    >
      {level}
    </div>
  );
}
