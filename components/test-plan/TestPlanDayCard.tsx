"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { TestPlanDay } from "@/lib/data/opportunities";
import type { TestPlanDayProgress } from "@/lib/storage/local-storage";

interface TestPlanDayCardProps {
  day: TestPlanDay;
  progress: TestPlanDayProgress;
  onToggle: () => void;
  onNotesChange: (notes: string) => void;
  onReflectionChange: (reflection: string) => void;
}

export function TestPlanDayCard({
  day,
  progress,
  onToggle,
  onNotesChange,
  onReflectionChange,
}: TestPlanDayCardProps) {
  const checkboxId = useId();
  const notesId = useId();
  const reflectionId = useId();

  return (
    <Card
      className={cn(
        "gap-4 p-6",
        progress.completed && "border-accent/40 bg-accent/5",
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          checked={progress.completed}
          onChange={onToggle}
          className="mt-1 size-5 shrink-0 cursor-pointer accent-accent"
        />
        <label htmlFor={checkboxId} className="flex min-w-0 flex-1 cursor-pointer flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Day {day.day}
          </span>
          <span
            className={cn(
              "text-base font-bold text-foreground",
              progress.completed && "text-muted-foreground line-through",
            )}
          >
            {day.task}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {day.estimatedTime}
            </span>
            {day.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </label>
      </div>

      <CardContent className="gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={notesId} className="text-xs text-muted-foreground">
            Notes
          </label>
          <Textarea
            id={notesId}
            value={progress.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes for this day..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={reflectionId}
            className="text-xs text-muted-foreground"
          >
            Result or reflection (optional)
          </label>
          <Textarea
            id={reflectionId}
            value={progress.reflection}
            onChange={(e) => onReflectionChange(e.target.value)}
            placeholder="What happened when you tried this?"
          />
        </div>
      </CardContent>
    </Card>
  );
}
