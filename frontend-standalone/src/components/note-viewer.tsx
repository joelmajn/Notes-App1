import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Note, type Category } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Star,
  Edit,
  Calendar,
  Bell,
} from "lucide-react";

interface NoteViewerProps {
  isOpen: boolean;
  note: Note | null;
  category?: Category;
  onClose: () => void;
  onEdit: () => void;
}

export function NoteViewer({ isOpen, note, category, onClose, onEdit }: NoteViewerProps) {
  if (!note) return null;

  const formatDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const formatDateRange = (startDate: Date | string | null, endDate: Date | string | null) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate).toLocaleDateString('pt-BR');
    const end = new Date(endDate).toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-viewer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle>Visualizar Nota</DialogTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={note.isFavorite ? "text-yellow-500" : ""}
              data-testid="button-favorite-viewer"
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              data-testid="button-edit-note"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Note Color Preview */}
          {note.color && note.color !== '#ffffff' && (
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-border"
                style={{ backgroundColor: note.color }}
              />
              <span className="text-sm text-muted-foreground">Cor da nota</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>Criada {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span>• Atualizada {formatDate(note.updatedAt)}</span>
            )}
            {category && (
              <div className="flex items-center space-x-2">
                <span>•</span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Period Range */}
          {note.startDate && note.endDate && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Período:</span>
                <span>{formatDateRange(note.startDate, note.endDate)}</span>
              </div>
            </div>
          )}

          {/* Reminder */}
          {note.reminderDate && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 text-sm">
                <Bell className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Lembrete:</span>
                <span>
                  {new Date(note.reminderDate).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {note.reminderRepeat && note.reminderRepeat !== "" && (
                  <>
                    <span>•</span>
                    <span>
                      Repetir:{" "}
                      {note.reminderRepeat === "daily" && "Diariamente"}
                      {note.reminderRepeat === "weekly" && "Semanalmente"}
                      {note.reminderRepeat === "monthly" && "Mensalmente"}
                      {note.reminderRepeat === "yearly" && "Anualmente"}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {note.content || "Sem conteúdo"}
            </div>
          </div>

          {/* Checklist */}
          {note.checklist && note.checklist.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Checklist</h3>
              <div className="space-y-2">
                {note.checklist.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      disabled
                      className="w-4 h-4"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground mt-2">
                  {note.checklist.filter(item => item.completed).length} de {note.checklist.length} concluídos
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}