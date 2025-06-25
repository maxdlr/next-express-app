const baseUrl = "http://localhost:3000";
const token = "?";

export interface ApiResponse {
  statusCode: number;
  message: string;
  payload: object | object[];
}

export type ApiError = ApiResponse;

const post = async (
  url: string,
  payload?: object | object[],
  authenticate: boolean = true,
) => {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (authenticate) {
    headers["Authorization"] = token;
  }

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const resBody = await response.json();

  return resBody;
};

export const ApiService = {
  token,
  post,
};
