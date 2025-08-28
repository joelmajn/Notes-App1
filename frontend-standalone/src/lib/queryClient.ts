import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Para compatibilidade com código existente, mantemos a função mas ela não será usada
export async function apiRequest(method: string, url: string, body?: any) {
  throw new Error("apiRequest não é usado na versão standalone - use as funções da API mockada diretamente");
}
