import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => api.categories.getAll(),
  });
}
