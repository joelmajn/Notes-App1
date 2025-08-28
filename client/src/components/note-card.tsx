import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Note, type Category } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Star,
  MoreHorizontal,
  Bell,
  Paperclip,
  Calendar,
} from "lucide-react";

interface NoteCardProps {
  note: Note;
  category?: Category;
  onClick: () => void;
}

export function NoteCard({ note, category, onClick }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", `/api/notes/${note.id}`, {
        isFavorite: !note.isFavorite,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: note.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement context menu
  };

  const completedTasks = note.checklist ? note.checklist.filter(item => item.completed).length : 0;
  const totalTasks = note.checklist ? note.checklist.length : 0;
  const previewTasks = note.checklist ? note.checklist.slice(0, 2) : [];
  const remainingTasks = totalTasks - previewTasks.length;

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate).toLocaleDateString('pt-BR');
    const end = new Date(endDate).toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  };

  return (
    <div
      className="note-card rounded-lg border border-border p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{
        backgroundColor: note.color && note.color !== '#ffffff' ? `${note.color}15` : 'hsl(var(--card))',
        borderLeft: note.color && note.color !== '#ffffff' ? `4px solid ${note.color}` : undefined,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {category && (
            <>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-muted-foreground">{category.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${note.isFavorite ? "text-yellow-500" : "text-muted-foreground"} hover:text-yellow-500`}
            onClick={handleToggleFavorite}
            data-testid={`button-favorite-${note.id}`}
          >
            <Star className={`w-3 h-3 ${note.isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleMenuClick}
            data-testid={`button-menu-${note.id}`}
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Title and Content */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2" data-testid={`text-title-${note.id}`}>
        {note.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3" data-testid={`text-content-${note.id}`}>
        {note.content}
      </p>

      {/* Checklist Preview */}
      {note.checklist && note.checklist.length > 0 && (
        <div className="mb-3">
          {previewTasks.map(item => (
            <div key={item.id} className="flex items-center space-x-2 mb-1">
              <Checkbox
                checked={item.completed}
                className="w-3 h-3"
                disabled
                data-testid={`checkbox-${item.id}`}
              />
              <span
                className={`text-xs ${
                  item.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.text}
              </span>
            </div>
          ))}
          {remainingTasks > 0 && (
            <span className="text-xs text-muted-foreground ml-5">
              +{remainingTasks} mais
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex items-center space-x-2 mb-3 flex-wrap gap-1">
          {note.tags && note.tags.slice(0, 2).map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5"
              data-testid={`tag-${tag}`}
            >
              {tag}
            </Badge>
          ))}
          {note.tags && note.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{note.tags ? note.tags.length - 2 : 0}
            </Badge>
          )}
        </div>
      )}

      {/* Period Range */}
      {note.startDate && note.endDate && (
        <div className="mb-3">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Período: {formatDateRange(note.startDate, note.endDate)}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span data-testid={`text-date-${note.id}`}>
            {formatDate(note.updatedAt)}
          </span>
          {note.reminderDate && (
            <div className="flex items-center space-x-1">
              <Bell className="w-3 h-3" />
              <span>
                {new Date(note.reminderDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
        {/* Placeholder for attachments */}
        <Paperclip className="w-3 h-3 opacity-0" />
      </div>
    </div>
  );
}
