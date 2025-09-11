import axios from "axios"

// ------------------- Config -------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 10000,
})

// ------------------- Types -------------------
export interface SustainabilityAction {
  id?: number
  action: string
  date: string // YYYY-MM-DD
  points: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  public status: number
  public response?: any

  constructor(message: string, status: number, response?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.response = response
  }
}

// ------------------- Axios Wrapper -------------------
async function apiRequest<T>(
  url: string,
  options: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; data?: any } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", data } = options

  try {
    const response = await apiClient.request<ApiResponse<T>>({
      url,
      method,
      data,
    })
    return response.data
  } catch (err: unknown) {
    // Safe runtime narrowing
    const error = err as any
    if (error?.isAxiosError) {
      const status = error.response?.status || 0
      const responseData = error.response?.data
      const message =
        (responseData && (responseData.error || responseData.message)) ||
        error.message ||
        "Network error occurred"
      throw new ApiError(message, status, responseData)
    }
    throw new ApiError(error instanceof Error ? error.message : "Unexpected error", 0)
  }
}

// ------------------- API Functions -------------------
export async function getAllActions(): Promise<SustainabilityAction[]> {
  const res = await apiRequest<SustainabilityAction[]>("/actions/")
  return res.data || []
}

export async function getActionById(id: number): Promise<SustainabilityAction> {
  const res = await apiRequest<SustainabilityAction>(`/actions/${id}/`)
  if (!res.data) throw new ApiError("Action not found", 404)
  return res.data
}

export async function createAction(actionData: Omit<SustainabilityAction, "id">): Promise<SustainabilityAction> {
  const res = await apiRequest<SustainabilityAction>("/actions/", { method: "POST", data: actionData })
  if (!res.data) throw new ApiError("Failed to create action", 500)
  return res.data
}

export async function updateAction(
  id: number,
  actionData: Partial<SustainabilityAction>,
  partial = true
): Promise<SustainabilityAction> {
  const method = partial ? "PATCH" : "PUT"
  const res = await apiRequest<SustainabilityAction>(`/actions/${id}/`, { method, data: actionData })
  if (!res.data) throw new ApiError("Failed to update action", 500)
  return res.data
}

export async function deleteAction(id: number): Promise<boolean> {
  await apiRequest<null>(`/actions/${id}/`, { method: "DELETE" })
  return true
}

export async function checkApiHealth(): Promise<{
  status: string
  statistics: { total_actions: number; total_points: number }
}> {
  const res = await apiRequest<{ status: string; statistics: { total_actions: number; total_points: number } }>("/health/")
  if (!res.data) throw new ApiError("Invalid health check response", 500)
  return res.data
}

// ------------------- Utility -------------------
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.response?.errors) {
      return Object.entries(error.response.errors)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : ""}`)
        .join("; ")
    }
    return error.message
  }

  if (error instanceof Error) return error.message
  return "Unexpected error occurred"
}
