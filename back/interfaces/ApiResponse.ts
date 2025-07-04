export interface ApiResponseInterface {
  statusCode: number;
  message: string;
  payload?: any | any[];
}

export class ApiResponse {
  public statusCode: number = 200;
  public message?: string;
  public payload?: any | any[];

  constructor(payload?: any | any[]) {
    if (payload !== undefined) this.payload = payload;
  }

  private setMessage(
    message: string,
    type:
      | "success"
      | "created"
      | "bad-request"
      | "not-found"
      | "server-failure"
      | "conflict"
      | "authentication-failure",
  ) {
    let prefix = "";
    switch (type) {
      case "success":
        prefix = "Success: ";
        break;

      case "created":
        prefix = "Created: ";
        break;

      case "bad-request":
        prefix = "Bad Request: ";
        break;

      case "not-found":
        prefix = "Not Found: ";
        break;

      case "server-failure":
        prefix = "Server Failure: ";
        break;

      case "authentication-failure":
        prefix = "Authentication Failure: ";
        break;

      case "conflict":
        prefix = "Conflict: ";
        break;

      default:
        break;
    }
    this.message = prefix + message;
  }

  public asCreated = (message?: string) => {
    this.statusCode = 201;
    if (message) this.setMessage(message, "created");
    return this;
  };

  public asSuccess = (message?: string) => {
    this.statusCode = 200;
    if (message) this.setMessage(message, "success");
    return this;
  };

  public asBadRequest = (message?: string) => {
    this.statusCode = 400;
    if (message) this.setMessage(message, "bad-request");
    return this;
  };

  public asNotFound = (message?: string) => {
    this.statusCode = 404;
    if (message) this.setMessage(message, "not-found");
    return this;
  };

  public asServerFailure = (message?: string) => {
    this.statusCode = 500;
    if (message) this.setMessage(message, "server-failure");
    return this;
  };

  public asAuthenticationFailure = (message?: string) => {
    this.statusCode = 401;
    if (message) this.setMessage(message, "authentication-failure");
    return this;
  };

  public asAuthenticationTokenFailure = (message?: string) => {
    this.statusCode = 403;
    if (message) this.setMessage(message, "authentication-failure");
    return this;
  };

  public asConflict = (message?: string) => {
    this.statusCode = 11000;
    if (message) this.setMessage(message, "conflict");
    return this;
  };
}
