/**
 * API service functions for communicating with the Django REST API.
 *
 * Centralized interface for all HTTP requests to the sustainability
 * actions backend API, with proper error handling and type safety.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface SustainabilityAction {
  id?: number;
  action: string;
  date: string; // ISO date string (YYYY-MM-DD)
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public status: number;
  public response?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Handle 204 No Content
    if (response.status === 204) return {} as T;

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new ApiError("Invalid JSON response from server", response.status);
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;

    throw new ApiError(
      err instanceof Error ? err.message : "Network error occurred",
      0,
      { originalError: err }
    );
  }
}

/** Get all actions */
export async function getAllActions(): Promise<SustainabilityAction[]> {
  const response = await apiRequest<ApiResponse<SustainabilityAction[]>>("/actions/");
  return response.data || [];
}

/** Get one action by ID */
export async function getActionById(id: number): Promise<SustainabilityAction> {
  const response = await apiRequest<ApiResponse<SustainabilityAction>>(`/actions/${id}/`);
  if (!response.data) throw new ApiError("Action not found", 404);
  return response.data;
}

/** Create a new action */
export async function createAction(actionData: Omit<SustainabilityAction, "id">): Promise<SustainabilityAction> {
  const response = await apiRequest<ApiResponse<SustainabilityAction>>("/actions/", {
    method: "POST",
    body: JSON.stringify(actionData),
  });
  if (!response.data) throw new ApiError("Failed to create action", 500);
  return response.data;
}

/** Update an action */
export async function updateAction(
  id: number,
  actionData: Partial<SustainabilityAction>,
  partial = true
): Promise<SustainabilityAction> {
  const method = partial ? "PATCH" : "PUT";
  const response = await apiRequest<ApiResponse<SustainabilityAction>>(`/actions/${id}/`, {
    method,
    body: JSON.stringify(actionData),
  });
  if (!response.data) throw new ApiError("Failed to update action", 500);
  return response.data;
}

/** Delete an action */
export async function deleteAction(id: number): Promise<boolean> {
  await apiRequest<ApiResponse<null>>(`/actions/${id}/`, { method: "DELETE" });
  return true;
}

/** API health check */
export async function checkApiHealth(): Promise<{ status: string; statistics: { total_actions: number; total_points: number } }> {
  const response = await apiRequest<ApiResponse<{ status: string; statistics: { total_actions: number; total_points: number } }>>("/health/");
  if (!response.data) throw new ApiError("Invalid health check response", 500);
  return response.data;
}

/** Format API error for display */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.response?.errors) {
      const messages = Object.entries(error.response.errors)
        .map(([field, msgs]) => {
          // Assert msgs is string[]
          const fieldMsgs = Array.isArray(msgs) ? msgs : [];
          return `${field}: ${fieldMsgs.join(", ")}`;
        })
        .join("; ");
      return `Validation error: ${messages}`;
    }
    return error.message || "An API error occurred";
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred";
}
