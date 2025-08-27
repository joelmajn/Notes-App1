import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { FilterBar } from "@/components/filter-bar";
import { NoteCard } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { MobileNav } from "@/components/mobile-nav";
import { useNotes } from "@/hooks/use-notes";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type Note } from "@shared/schema";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "favorites" | "archived" | "reminders">("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: notes = [], isLoading } = useNotes({
    search: searchQuery,
    category: selectedCategory,
    tag: selectedTag,
    favorite: viewMode === "favorites",
    archived: viewMode === "archived",
    reminders: viewMode === "reminders",
  });

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null);
    setViewMode("all");
  };

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedCategory(null);
    setViewMode("all");
  };

  const filteredNotes = notes.filter(note => {
    if (viewMode === "archived" && !note.isArchived) return false;
    if (viewMode !== "archived" && note.isArchived) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        notes={filteredNotes}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewNote={handleNewNote}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          notesCount={filteredNotes.length}
        />

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategorySelect={handleCategoryFilter}
          onTagSelect={handleTagFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Notes Grid */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  category={categories.find(c => c.id === note.categoryId)}
                  onClick={() => handleEditNote(note)}
                  data-testid={`note-card-${note.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery || selectedCategory || selectedTag
                  ? "Nenhuma nota encontrada"
                  : "Nenhuma nota ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory || selectedTag
                  ? "Tente ajustar os filtros de busca."
                  : "Comece criando sua primeira nota."}
              </p>
              <Button onClick={handleNewNote} data-testid="button-create-first-note">
                <Plus className="w-4 h-4 mr-2" />
                {searchQuery || selectedCategory || selectedTag
                  ? "Nova nota"
                  : "Criar primeira nota"}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - Mobile */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg md:hidden z-40"
        onClick={handleNewNote}
        data-testid="button-fab-new-note"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={isEditorOpen}
        note={editingNote}
        categories={categories}
        onClose={handleCloseEditor}
      />
    </div>
  );
}
