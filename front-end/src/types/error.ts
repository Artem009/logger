export interface ErrorEntry {
  id: string;
  data: string;
  counter: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateErrorInput {
  data: string;
  counter?: number;
}

export interface UpdateErrorInput {
  data?: string;
  counter?: number;
}

export interface AdviceResponse {
  advice: string;
}
