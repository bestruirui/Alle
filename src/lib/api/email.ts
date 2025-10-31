import type { Email, ApiResponse } from "@/types";

export interface FetchEmailsParams {
  token: string;
  limit?: number;
  offset?: number;
}

export async function fetchEmails({
  token,
  limit = 100,
  offset = 0,
}: FetchEmailsParams): Promise<Email[]> {
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (offset) params.append("offset", String(offset));

  const url = `/api/email/list${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch emails: ${response.statusText}`);
  }

  const data = (await response.json()) as ApiResponse<Email[]>;

  if (!data.success || !data.data) {
    throw new Error(data.error || "Failed to fetch emails");
  }

  return data.data;
}

export interface DeleteEmailsParams {
  token: string;
  emailIds: number[];
}

export async function deleteEmails({
  token,
  emailIds,
}: DeleteEmailsParams): Promise<void> {
  const response = await fetch("/api/email/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(emailIds),
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`Failed to delete emails: ${response.statusText}`);
  }

  const data = (await response.json()) as ApiResponse<null>;

  if (!data.success) {
    throw new Error(data.error || "Failed to delete emails");
  }
}
