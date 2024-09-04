export default async function customFetch(
    url: string,
    method: "GET" | "POST",
    body?: any,
    headers?: HeadersInit
) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) 
        return 'error';
  
    const requestUrl = baseUrl + url;
  
    const options: RequestInit = {
        method: method,
        headers: {
            ...headers,
        },
    };

    if (method === "POST" && body) {
        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.headers = {
                "Content-Type": "application/json",
                ...options.headers,
            };
            options.body = JSON.stringify(body);
        }
    }
  
    try {
        const response = await fetch(requestUrl, options);
  
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }
  
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return 'error';
    }
}
  