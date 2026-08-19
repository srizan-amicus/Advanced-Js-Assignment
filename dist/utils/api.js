export async function apiRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                success: false,
                error: `Request failed with status ${response.status}`,
            };
        }
        const data = await response.json();
        return {
            success: true,
            data,
        };
    }
    catch (error) {
        console.error("API request failed:", error);
        return {
            success: false,
            error: "Network error. Please try again.",
        };
    }
}
