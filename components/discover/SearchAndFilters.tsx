import { X } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { ChipGroup } from "@/components/ui/chip-group";
import { Button } from "@/components/ui/button";
import {
  DIFFICULTY_LEVELS,
  COST_BUCKETS,
  type Difficulty,
  type CostBucket,
} from "@/lib/data/opportunities";

export type SortOption =
  | "bestMatch"
  | "newest"
  | "lowestCost"
  | "strongestEvidence";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "bestMatch", label: "Best match" },
  { value: "newest", label: "Newest" },
  { value: "lowestCost", label: "Lowest startup cost" },
  { value: "strongestEvidence", label: "Strongest evidence" },
];

interface SearchAndFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedDifficulty: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty | null) => void;
  selectedCostBucket: CostBucket | null;
  onSelectCostBucket: (bucket: CostBucket | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export function SearchAndFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedCostBucket,
  onSelectCostBucket,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearAll,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <X />
            Clear all filters
          </Button>
        )}
      </div>

      <ChipGroup label="Category">
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onClick={() =>
              onSelectCategory(selectedCategory === category ? null : category)
            }
          >
            {category}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Difficulty">
        {DIFFICULTY_LEVELS.map((level) => (
          <Chip
            key={level}
            selected={selectedDifficulty === level}
            onClick={() =>
              onSelectDifficulty(selectedDifficulty === level ? null : level)
            }
          >
            {level}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Startup cost">
        {COST_BUCKETS.map((bucket) => (
          <Chip
            key={bucket}
            selected={selectedCostBucket === bucket}
            onClick={() =>
              onSelectCostBucket(selectedCostBucket === bucket ? null : bucket)
            }
          >
            {bucket}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
