export type ApiResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export async function apiRequest<T>(url: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}`,
      };
    }

    const data: T = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("API request failed:", error);

    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}