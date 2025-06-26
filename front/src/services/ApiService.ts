const baseUrl = "http://localhost:3000";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  payload: T;
}

export type ApiError = ApiResponse<any>;

export interface User {
  email: string;
  id: string;
  username: string;
}

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

const getUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user="))
    ?.split("=")[1];

  if (!cookieValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    return null;
  }
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
    removeUser();
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

const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    const userString = encodeURIComponent(JSON.stringify(user));
    document.cookie = `user=${userString}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure=${location.protocol === "https:"}`;
  }
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

const removeUser = () => {
  if (typeof window !== "undefined") {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
  setUser,
  removeUser,
  getUser,
  isAuthenticated,
};
