import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Note, type Category, type ChecklistItem } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoteSchema } from "@shared/schema";
import { z } from "zod";
import {
  ArrowLeft,
  Star,
  Bell,
  Plus,
  Trash2,
  Calendar,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Cores predefinidas para as notas
const NOTE_COLORS = [
  { name: "Branco", value: "#ffffff" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Laranja", value: "#f97316" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Cinza", value: "#6b7280" },
  { name: "Verde Claro", value: "#84cc16" },
];

const noteFormSchema = z.object({
  title: z.string(),
  content: z.string(),
  categoryId: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  checklist: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })).optional(),
  reminderDate: z.string().optional(),
  reminderRepeat: z.string().optional(),
  color: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFavorite: z.boolean(),
  isArchived: z.boolean(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: "Data final deve ser posterior à data inicial",
  path: ["endDate"],
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteEditorProps {
  isOpen: boolean;
  note: Note | null;
  categories: Category[];
  onClose: () => void;
}

export function NoteEditor({ isOpen, note, categories, onClose }: NoteEditorProps) {
  const [tagInput, setTagInput] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: null,
      tags: [],
      checklist: [],
      reminderDate: undefined,
      reminderRepeat: "none",
      color: "#ffffff",
      startDate: undefined,
      endDate: undefined,
      isFavorite: false,
      isArchived: false,
    },
  });

  // Initialize form with note data when editing
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        categoryId: note.categoryId || null,
        tags: note.tags || [],
        checklist: note.checklist || [],
        reminderDate: note.reminderDate ? new Date(note.reminderDate).toISOString().slice(0, 16) : undefined,
        reminderRepeat: note.reminderRepeat || "none",
        color: note.color || "#ffffff",
        startDate: note.startDate ? new Date(note.startDate).toISOString().slice(0, 10) : undefined,
        endDate: note.endDate ? new Date(note.endDate).toISOString().slice(0, 10) : undefined,
        isFavorite: note.isFavorite || false,
        isArchived: note.isArchived || false,
      });
      setChecklist(note.checklist || []);
    } else {
      form.reset({
        title: "",
        content: "",
        categoryId: null,
        tags: [],
        checklist: [],
        reminderDate: undefined,
        reminderRepeat: "none",
        color: "#ffffff",
        startDate: undefined,
        endDate: undefined,
        isFavorite: false,
        isArchived: false,
      });
      setChecklist([]);
    }
  }, [note, form]);

  const createNoteMutation = useMutation({
    mutationFn: (data: NoteFormData) => apiRequest("POST", "/api/notes", data),
    onSuccess: () => {
      console.log("✅ Nota criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Nota criada com sucesso!" });
      onClose();
    },
    onError: (error: any) => {
      console.error("❌ Erro ao criar nota:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível criar a nota",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (data: NoteFormData) =>
      apiRequest("PATCH", `/api/notes/${note!.id}`, data),
    onSuccess: () => {
      console.log("✅ Nota atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Nota atualizada com sucesso!" });
      onClose();
    },
    onError: (error: any) => {
      console.error("❌ Erro ao atualizar nota:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Não foi possível atualizar a nota",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: NoteFormData) => {
    // Log para debugging
    console.log("🔍 Dados do formulário enviados:", data);
    console.log("🔍 Checklist:", checklist);
    
    const formData = {
      ...data,
      checklist,
      // Garantir que campos obrigatórios não sejam undefined
      title: data.title || "",
      content: data.content || "",
      // Converter datas para o formato correto
      reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : undefined,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      // Garantir que categoryId seja null em vez de string vazia
      categoryId: data.categoryId === "none" ? null : data.categoryId,
      // Garantir que reminderRepeat seja string vazia em vez de "none"
      reminderRepeat: data.reminderRepeat === "none" ? "" : data.reminderRepeat,
    };
    
    console.log("📤 Dados processados enviados para API:", formData);

    if (note) {
      updateNoteMutation.mutate(formData);
    } else {
      createNoteMutation.mutate(formData);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddChecklistItem = () => {
    if (!newTaskInput.trim()) return;
    
    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newTaskInput.trim(),
      completed: false,
    };
    
    setChecklist([...checklist, newItem]);
    setNewTaskInput("");
  };

  const handleUpdateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const currentTags = form.watch("tags") || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-editor"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle>
              {note ? "Editar Nota" : "Nova Nota"}
            </DialogTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => form.setValue("isFavorite", !form.watch("isFavorite"))}
              className={form.watch("isFavorite") ? "text-yellow-500" : ""}
              data-testid="button-toggle-favorite"
            >
              <Star className={`w-4 h-4 ${form.watch("isFavorite") ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-reminder"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
              data-testid="button-save-note"
            >
              Salvar
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-120px)] space-y-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Title */}
            <Input
              {...form.register("title")}
              placeholder="Título da nota..."
              className="text-2xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="input-note-title"
            />

            {/* Category and Tags */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Label htmlFor="category" className="text-sm text-muted-foreground whitespace-nowrap">
                  Categoria:
                </Label>
                <Select
                  value={form.watch("categoryId") || "none"}
                  onValueChange={(value) => form.setValue("categoryId", value === "none" ? null : value)}
                >
                  <SelectTrigger className="w-48" data-testid="select-category">
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma categoria</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 flex-1">
                <Label htmlFor="tags" className="text-sm text-muted-foreground whitespace-nowrap">
                  Tags:
                </Label>
                <div className="flex flex-1 space-x-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Adicionar tags..."
                    className="flex-1"
                    data-testid="input-tags"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    data-testid="button-add-tag"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags Display */}
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4"
                      onClick={() => handleRemoveTag(tag)}
                      data-testid={`button-remove-tag-${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Color Selection */}
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Cor da nota:</Label>
              <div className="flex flex-wrap gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => form.setValue("color", color.value)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      form.watch("color") === color.value 
                        ? "border-primary ring-2 ring-primary ring-offset-2" 
                        : "border-border hover:border-primary"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    data-testid={`color-${color.value}`}
                  />
                ))}
              </div>
            </div>

            {/* Period Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Período</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">Data de Início:</Label>
                  <Input
                    type="date"
                    {...form.register("startDate")}
                    className="flex-1"
                    data-testid="input-start-date"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">Data Final:</Label>
                  <Input
                    type="date"
                    {...form.register("endDate")}
                    className="flex-1"
                    data-testid="input-end-date"
                  />
                </div>
              </div>
              {form.formState.errors.endDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <Textarea
                {...form.register("content")}
                placeholder="Escreva sua nota aqui..."
                className="min-h-64 resize-none"
                data-testid="textarea-note-content"
              />
            </div>

            {/* Checklist Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Checklist</h3>
              </div>

              <div className="space-y-2">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 border border-border rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) =>
                        handleUpdateChecklistItem(item.id, { completed: !!checked })
                      }
                      data-testid={`checkbox-task-${item.id}`}
                    />
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        handleUpdateChecklistItem(item.id, { text: e.target.value })
                      }
                      className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Item do checklist..."
                      data-testid={`input-task-${item.id}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-task-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center space-x-3 p-2 border border-dashed border-border rounded-lg">
                  <Input
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    placeholder="Adicionar novo item..."
                    className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="input-new-task"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddChecklistItem}
                    data-testid="button-add-task"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reminder Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Lembrete</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-muted-foreground whitespace-nowrap">Data e Hora:</Label>
                    <Input
                      type="datetime-local"
                      {...form.register("reminderDate")}
                      className="flex-1"
                      data-testid="input-reminder-date"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-muted-foreground whitespace-nowrap">Repetir:</Label>
                    <Select
                      value={form.watch("reminderRepeat") || "none"}
                      onValueChange={(value) => form.setValue("reminderRepeat", value === "none" ? "" : value)}
                    >
                      <SelectTrigger className="flex-1" data-testid="select-reminder-repeat">
                        <SelectValue placeholder="Não repetir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não repetir</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                        <SelectItem value="monthly">Mensalmente</SelectItem>
                        <SelectItem value="yearly">Anualmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Quick Date Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(9, 0, 0, 0);
                      form.setValue("reminderDate", tomorrow.toISOString().slice(0, 16) as any);
                    }}
                    data-testid="button-tomorrow"
                  >
                    Amanhã
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      nextWeek.setHours(9, 0, 0, 0);
                      form.setValue("reminderDate", nextWeek.toISOString().slice(0, 16) as any);
                    }}
                    data-testid="button-next-week"
                  >
                    Próxima Semana
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      nextMonth.setHours(9, 0, 0, 0);
                      form.setValue("reminderDate", nextMonth.toISOString().slice(0, 16) as any);
                    }}
                    data-testid="button-next-month"
                  >
                    Próximo Mês
                  </Button>
                  {form.watch("reminderDate") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("reminderDate", "" as any)}
                      data-testid="button-clear-reminder"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
