import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import {
  Menu,
  Search,
  Grid3X3,
  List,
  Filter,
  Calendar,
  Moon,
  Sun,
  Plus,
} from "lucide-react";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewNote: () => void;
  onToggleSidebar: () => void;
  notesCount: number;
}

export function TopBar({
  searchQuery,
  onSearchChange,
  onNewNote,
  onToggleSidebar,
  notesCount,
}: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-card border-b border-border p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onToggleSidebar}
            data-testid="button-toggle-sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-foreground">Todas as Notas</h2>
            <p className="text-sm text-muted-foreground">
              {notesCount} {notesCount === 1 ? "nota" : "notas"} • Última atualização há 5 min
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Bar - Desktop */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar notas, categorias, tags..."
              className="pl-10 w-80"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search-desktop"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            data-testid="button-filter"
          >
            <Filter className="w-4 h-4" />
          </Button>

          {/* Calendar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            data-testid="button-calendar"
          >
            <Calendar className="w-4 h-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* New Note Button - Desktop */}
          <Button
            className="hidden md:flex"
            onClick={onNewNote}
            data-testid="button-new-note-desktop"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar notas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="input-search-mobile"
          />
        </div>
      </div>
    </header>
  );
}
