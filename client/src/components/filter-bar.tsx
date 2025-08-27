import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Category } from "@shared/schema";
import { isToday, isThisWeek, isThisMonth } from "date-fns";

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onTagSelect: (tag: string | null) => void;
  onDateFilter?: (filter: 'today' | 'week' | 'month' | null) => void;
  viewMode: "all" | "favorites" | "archived" | "reminders";
  onViewModeChange: (mode: "all" | "favorites" | "archived" | "reminders") => void;
}

export function FilterBar({
  categories,
  selectedCategory,
  selectedTag,
  onCategorySelect,
  onTagSelect,
  viewMode,
  onViewModeChange,
  onDateFilter,
}: FilterBarProps) {
  return (
    <div className="bg-card border-b border-border px-4 md:px-6 py-3">
      <ScrollArea>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Filtrar por:</span>

          {/* Date Filters */}
          <Button
            variant={viewMode === "all" && !selectedCategory && !selectedTag ? "default" : "secondary"}
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => {
              onViewModeChange("all");
              onCategorySelect(null);
              onTagSelect(null);
            }}
            data-testid="filter-all"
          >
            Todas
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => onDateFilter?.('today')}
            data-testid="filter-today"
          >
            Hoje
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => onDateFilter?.('week')}
            data-testid="filter-week"
          >
            Esta Semana
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => onDateFilter?.('month')}
            data-testid="filter-month"
          >
            Este Mês
          </Button>

          <div className="w-px h-4 bg-border mx-2" />

          {/* Category Filters */}
          {categories.slice(0, 2).map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              size="sm"
              className="whitespace-nowrap rounded-full flex items-center space-x-1"
              onClick={() => onCategorySelect(category.id)}
              data-testid={`filter-category-${category.id}`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
