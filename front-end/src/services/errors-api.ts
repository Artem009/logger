import { apiClient } from "@/lib/api-client";
import type {
  ErrorEntry,
  CreateErrorInput,
  UpdateErrorInput,
  AdviceResponse,
} from "@/types/error";

export async function fetchErrors(): Promise<ErrorEntry[]> {
  const { data } = await apiClient.get<ErrorEntry[]>("/errors");
  return data;
}

export async function fetchError(id: string): Promise<ErrorEntry> {
  const { data } = await apiClient.get<ErrorEntry>(`/errors/${id}`);
  return data;
}

export async function createError(
  input: CreateErrorInput
): Promise<ErrorEntry> {
  const { data } = await apiClient.post<ErrorEntry>("/errors", input);
  return data;
}

export async function updateError(
  id: string,
  input: UpdateErrorInput
): Promise<ErrorEntry> {
  const { data } = await apiClient.patch<ErrorEntry>(`/errors/${id}`, input);
  return data;
}

export async function deleteError(id: string): Promise<void> {
  await apiClient.delete(`/errors/${id}`);
}

export async function getAdvice(): Promise<AdviceResponse> {
  const { data } = await apiClient.post<AdviceResponse>("/errors/advice");
  return data;
}
