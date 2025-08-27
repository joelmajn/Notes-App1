import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseNotesParams {
  search?: string;
  category?: string | null;
  tag?: string | null;
  favorite?: boolean;
  archived?: boolean;
  reminders?: boolean;
}

export function useNotes(params: UseNotesParams = {}) {
  return useQuery({
    queryKey: ["/api/notes", params],
    queryFn: () => api.notes.getAll({
      search: params.search,
      category: params.category || undefined,
      tag: params.tag || undefined,
      favorite: params.favorite,
      archived: params.archived,
      reminders: params.reminders,
    }),
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ["/api/notes", id],
    queryFn: () => api.notes.getById(id),
    enabled: !!id,
  });
}
