import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/hooks/use-notes";
import { type Note } from "@shared/schema";
import { Calendar as CalendarIcon, Clock, Bell } from "lucide-react";
import { format, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data: allNotes = [] } = useNotes();

  // Filter notes with reminders
  const notesWithReminders = allNotes.filter(note => note.reminderDate);

  // Get notes for selected date
  const getNotesForDate = (date: Date) => {
    return notesWithReminders.filter(note => {
      if (!note.reminderDate) return false;
      return isSameDay(new Date(note.reminderDate), date);
    });
  };

  // Get dates with reminders for calendar highlighting
  const getDatesWithReminders = () => {
    return notesWithReminders
      .filter(note => note.reminderDate)
      .map(note => new Date(note.reminderDate!));
  };

  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];

  const formatReminderTime = (date: string) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };

  const formatReminderDate = (date: string) => {
    const reminderDate = new Date(date);
    if (isToday(reminderDate)) {
      return "Hoje";
    }
    return format(reminderDate, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Calendário de Lembretes</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          {/* Calendar */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasReminder: getDatesWithReminders(),
              }}
              modifiersStyles={{
                hasReminder: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold',
                },
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Legenda</h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Dias com lembretes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Total: {notesWithReminders.length} lembretes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes for selected date */}
          <div className="flex-1">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>
                  Lembretes para {selectedDate ? formatReminderDate(selectedDate.toISOString()) : ""}
                </span>
              </h3>
              
              <ScrollArea className="h-80">
                {selectedDateNotes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateNotes.map(note => (
                      <div
                        key={note.id}
                        className="p-3 border border-border rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer"
                        data-testid={`calendar-note-${note.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground truncate">
                            {note.title}
                          </h4>
                          <Badge variant="outline" className="ml-2">
                            {formatReminderTime(note.reminderDate!)}
                          </Badge>
                        </div>
                        
                        {note.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {note.content}
                          </p>
                        )}
                        
                        {note.reminderRepeat && (
                          <Badge variant="secondary" className="text-xs">
                            {note.reminderRepeat === 'daily' && 'Diário'}
                            {note.reminderRepeat === 'weekly' && 'Semanal'}
                            {note.reminderRepeat === 'monthly' && 'Mensal'}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum lembrete para este dia</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">
                  {notesWithReminders.length}
                </p>
                <p className="text-sm text-muted-foreground">Total lembretes</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-foreground">
                  {getDatesWithReminders().length}
                </p>
                <p className="text-sm text-muted-foreground">Dias com lembretes</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}