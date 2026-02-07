import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchErrors,
  fetchError,
  createError,
  updateError,
  deleteError,
  getAdvice,
} from "./errors-api";
import type { CreateErrorInput, UpdateErrorInput } from "@/types/error";

export const errorsQueries = {
  all: ["errors"] as const,
  list: () =>
    queryOptions({
      queryKey: [...errorsQueries.all, "list"],
      queryFn: fetchErrors,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...errorsQueries.all, "detail", id],
      queryFn: () => fetchError(id),
    }),
};

export function useCreateError() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateErrorInput) => createError(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorsQueries.all });
    },
  });
}

export function useUpdateError() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateErrorInput }) =>
      updateError(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorsQueries.all });
    },
  });
}

export function useDeleteError() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteError(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorsQueries.all });
    },
  });
}

export function useGetAdvice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getAdvice(),
  });
}
