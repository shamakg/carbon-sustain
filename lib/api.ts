/**
 * API service functions for communicating with the Django REST API.
 *
 * This module provides a centralized interface for all HTTP requests
 * to the sustainability actions backend API, including proper error
 * handling and type safety.
 */

// Base configuration for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

/**
 * Interface defining the structure of a sustainability action.
 * Matches the Django model and API response format.
 */
export interface SustainabilityAction {
  id?: number
  action: string
  date: string // ISO date string (YYYY-MM-DD)
  points: number
}

/**
 * Interface for API response wrapper.
 * Provides consistent response structure across all endpoints.
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * Custom error class for API-related errors.
 * Provides structured error information for better error handling.
 */
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

/**
 * Generic function to make HTTP requests with proper error handling.
 *
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise resolving to the parsed JSON response
 * @throws ApiError for HTTP errors or network issues
 */
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    // Set default headers for JSON communication
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    // Merge default headers with provided options
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    // Make the HTTP request
    const response = await fetch(`${API_BASE_URL}${url}`, config)

    // Parse JSON response
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      // Handle cases where response is not valid JSON
      throw new ApiError("Invalid JSON response from server", response.status, { parseError })
    }

    // Check if request was successful
    if (!response.ok) {
      // Extract error message from response or use default
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}`
      throw new ApiError(errorMessage, response.status, data)
    }

    return data
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors and other exceptions
    throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 0, { originalError: error })
  }
}

/**
 * Retrieve all sustainability actions from the API.
 *
 * @returns Promise resolving to an array of sustainability actions
 * @throws ApiError if the request fails
 */
export async function getAllActions(): Promise<SustainabilityAction[]> {
  try {
    const response = await apiRequest<ApiResponse<SustainabilityAction[]>>("/actions/")

    // Return the data array or empty array if no data
    return response.data || []
  } catch (error) {
    console.error("Error fetching actions:", error)
    throw error
  }
}

/**
 * Retrieve a specific sustainability action by ID.
 *
 * @param id - The ID of the action to retrieve
 * @returns Promise resolving to the sustainability action
 * @throws ApiError if the action is not found or request fails
 */
export async function getActionById(id: number): Promise<SustainabilityAction> {
  try {
    const response = await apiRequest<ApiResponse<SustainabilityAction>>(`/actions/${id}/`)

    if (!response.data) {
      throw new ApiError("Action not found", 404)
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching action ${id}:`, error)
    throw error
  }
}

/**
 * Create a new sustainability action.
 *
 * @param actionData - The action data (without ID)
 * @returns Promise resolving to the created action with assigned ID
 * @throws ApiError if validation fails or request fails
 */
export async function createAction(actionData: Omit<SustainabilityAction, "id">): Promise<SustainabilityAction> {
  try {
    const response = await apiRequest<ApiResponse<SustainabilityAction>>("/actions/", {
      method: "POST",
      body: JSON.stringify(actionData),
    })

    if (!response.data) {
      throw new ApiError("Failed to create action", 500)
    }

    return response.data
  } catch (error) {
    console.error("Error creating action:", error)
    throw error
  }
}

/**
 * Update an existing sustainability action.
 *
 * @param id - The ID of the action to update
 * @param actionData - The updated action data
 * @param partial - Whether to perform a partial update (PATCH) or full update (PUT)
 * @returns Promise resolving to the updated action
 * @throws ApiError if the action is not found or request fails
 */
export async function updateAction(
  id: number,
  actionData: Partial<SustainabilityAction>,
  partial = true,
): Promise<SustainabilityAction> {
  try {
    const method = partial ? "PATCH" : "PUT"
    const response = await apiRequest<ApiResponse<SustainabilityAction>>(`/actions/${id}/`, {
      method,
      body: JSON.stringify(actionData),
    })

    if (!response.data) {
      throw new ApiError("Failed to update action", 500)
    }

    return response.data
  } catch (error) {
    console.error(`Error updating action ${id}:`, error)
    throw error
  }
}

/**
 * Delete a sustainability action by ID.
 *
 * @param id - The ID of the action to delete
 * @returns Promise resolving to true if deletion was successful
 * @throws ApiError if the action is not found or request fails
 */
export async function deleteAction(id: number): Promise<boolean> {
  try {
    await apiRequest<ApiResponse<null>>(`/actions/${id}/`, {
      method: "DELETE",
    })

    return true
  } catch (error) {
    console.error(`Error deleting action ${id}:`, error)
    throw error
  }
}

/**
 * Check the health status of the API.
 *
 * @returns Promise resolving to API health information
 * @throws ApiError if the API is not responding
 */
export async function checkApiHealth(): Promise<{
  status: string
  statistics: {
    total_actions: number
    total_points: number
  }
}> {
  try {
    const response =
      await apiRequest<
        ApiResponse<{
          status: string
          statistics: {
            total_actions: number
            total_points: number
          }
        }>
      >("/health/")

    if (!response.data) {
      throw new ApiError("Invalid health check response", 500)
    }

    return response.data
  } catch (error) {
    console.error("Error checking API health:", error)
    throw error
  }
}

/**
 * Utility function to format API errors for user display.
 *
 * @param error - The error to format
 * @returns User-friendly error message
 */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    // Handle validation errors
    if (error.response?.errors) {
      const errorMessages = Object.entries(error.response.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ")
      return `Validation error: ${errorMessages}`
    }

    // Handle other API errors
    return error.message || "An API error occurred"
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}
