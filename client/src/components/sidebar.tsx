import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type Category, type Note } from "@shared/schema";
import {
  Home,
  Star,
  Bell,
  Archive,
  Trash,
  Settings,
  Plus,
  StickyNote,
  MoreHorizontal,
} from "lucide-react";

interface SidebarProps {
  categories: Category[];
  notes: Note[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  viewMode: "all" | "favorites" | "archived" | "reminders";
  onViewModeChange: (mode: "all" | "favorites" | "archived" | "reminders") => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  categories,
  notes,
  selectedCategory,
  onCategorySelect,
  viewMode,
  onViewModeChange,
  isOpen,
}: SidebarProps) {
  const favoriteNotes = notes.filter(note => note.isFavorite);
  const archivedNotes = notes.filter(note => note.isArchived);
  const reminderNotes = notes.filter(note => note.reminderDate);

  const getCategoryNotesCount = (categoryId: string) => {
    return notes.filter(note => note.categoryId === categoryId && !note.isArchived).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => onToggle()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 md:z-auto h-full w-64 bg-card border-r border-border transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">NotesApp</h1>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              <Button
                variant={viewMode === "all" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onViewModeChange("all");
                  onCategorySelect(null);
                }}
                data-testid="nav-all-notes"
              >
                <Home className="w-4 h-4 mr-3" />
                Todas as Notas
                <span className="ml-auto bg-muted text-muted-foreground px-2 py-1 text-xs rounded-full">
                  {notes.filter(note => !note.isArchived).length}
                </span>
              </Button>

              <Button
                variant={viewMode === "favorites" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onViewModeChange("favorites");
                  onCategorySelect(null);
                }}
                data-testid="nav-favorites"
              >
                <Star className="w-4 h-4 mr-3" />
                Favoritas
                {favoriteNotes.length > 0 && (
                  <span className="ml-auto bg-muted text-muted-foreground px-2 py-1 text-xs rounded-full">
                    {favoriteNotes.length}
                  </span>
                )}
              </Button>

              <Button
                variant={viewMode === "reminders" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onViewModeChange("reminders");
                  onCategorySelect(null);
                }}
                data-testid="nav-reminders"
              >
                <Bell className="w-4 h-4 mr-3" />
                Lembretes
                {reminderNotes.length > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded-full">
                    {reminderNotes.length}
                  </span>
                )}
              </Button>

              <Button
                variant={viewMode === "archived" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onViewModeChange("archived");
                  onCategorySelect(null);
                }}
                data-testid="nav-archived"
              >
                <Archive className="w-4 h-4 mr-3" />
                Arquivo
                {archivedNotes.length > 0 && (
                  <span className="ml-auto bg-muted text-muted-foreground px-2 py-1 text-xs rounded-full">
                    {archivedNotes.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                data-testid="nav-trash"
              >
                <Trash className="w-4 h-4 mr-3" />
                Lixeira
              </Button>
            </nav>

            {/* Categories */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground">CATEGORIAS</h3>
              </div>
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 justify-start h-8 px-2",
                        selectedCategory === category.id && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => onCategorySelect(category.id)}
                      data-testid={`category-${category.id}`}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({getCategoryNotesCount(category.id)})
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      data-testid={`category-menu-${category.id}`}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-muted-foreground"
                  data-testid="button-new-category"
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Nova Categoria
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start"
              data-testid="nav-settings"
            >
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
