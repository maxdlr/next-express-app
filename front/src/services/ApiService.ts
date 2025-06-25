const baseUrl = "http://localhost:3000";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  payload: T;
}

export type ApiError = ApiResponse<any>;

const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return cookieValue || null;
};

const getHeaders = (authenticate: boolean = true) => {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (authenticate) {
    const token = getToken();
    if (!token) {
      return headers;
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (response.status === 401 || response.status === 403) {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return data;
};

const post = async (
  url: string,
  payload?: object | object[],
  authenticate: boolean = true,
) => {
  const headers = getHeaders(authenticate);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const get = async (url: string, authenticate: boolean = true) => {
  const headers = getHeaders(authenticate);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "GET",
    headers,
  });

  return handleResponse(response);
};

const put = async (
  url: string,
  payload?: object | object[],
  authenticate: boolean = true,
) => {
  const headers = getHeaders(authenticate);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const del = async (url: string, authenticate: boolean = true) => {
  const headers = getHeaders(authenticate);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "DELETE",
    headers,
  });

  return handleResponse(response);
};

const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure=${location.protocol === "https:"}`;
  }
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const ApiService = {
  post,
  get,
  put,
  delete: del,
  setToken,
  removeToken,
  getToken,
  isAuthenticated,
};
