import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Clone the response so we can read it without consuming the original
    const clonedRes = res.clone();
    const contentType = clonedRes.headers.get("content-type");
    let errorMessage = res.statusText;
    
    try {
      if (contentType && contentType.includes("application/json")) {
        const json = await clonedRes.json();
        errorMessage = json.error || json.message || JSON.stringify(json);
      } else {
        const text = await clonedRes.text();
        // If it's HTML, extract a meaningful error message
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          errorMessage = `Server returned HTML instead of JSON (likely an error page). Status: ${res.status}`;
        } else {
          errorMessage = text.substring(0, 200) || res.statusText;
        }
      }
    } catch (e) {
      // If we can't parse the error, use status text
      errorMessage = res.statusText;
    }
    
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    // Check if response is JSON before parsing
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      // If not JSON, read as text and try to parse, or throw a more helpful error
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Expected JSON response but received ${contentType || "unknown content type"}. Response: ${text.substring(0, 100)}`);
      }
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
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
