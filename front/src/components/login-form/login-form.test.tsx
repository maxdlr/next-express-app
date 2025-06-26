import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoginForm from "./login-form.tsx";
import { AuthService } from "@/services/AuthService";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

jest.mock("@/services/AuthService", () => ({
  AuthService: {
    login: jest.fn(),
  },
}));

jest.mock("@/components/button/button", () => {
  return function MockButton({ label, type, disabled, ...props }: any) {
    return (
      <button type={type} disabled={disabled} {...props}>
        {label}
      </button>
    );
  };
});

jest.mock("@/components/input/input", () => {
  return function MockInput({ name, placeholder, type, label, ...props }: any) {
    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          {...props}
        />
      </div>
    );
  };
});

describe("LoginForm", () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders login form with email and password inputs", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("bruce@bat.cave")).toBeVisible();
    expect(screen.getByPlaceholderText("imb@tman")).toBeVisible();
    expect(screen.getByText("Se connecter")).toBeVisible();
  });

  it("shows loading state when form is submitted", async () => {
    (AuthService.login as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<LoginForm />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Let's go...")).toBeVisible();
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  it("handles successful login", async () => {
    const mockResponse = {
      statusCode: 200,
      message: "Login successful",
    };
    (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Login successful");
    });

    jest.advanceTimersByTime(100);

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("handles login error with status code >= 400", async () => {
    const mockResponse = {
      statusCode: 400,
      message: "Invalid credentials",
    };
    (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles login exception", async () => {
    const mockError = new Error("Network error");
    (AuthService.login as jest.Mock).mockRejectedValue(mockError);

    render(<LoginForm />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });

    expect(screen.getByText("Se connecter")).toBeVisible();
  });

  it("passes form data to AuthService.login", async () => {
    const mockResponse = {
      statusCode: 200,
      message: "Success",
    };
    (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("bruce@bat.cave");
    const passwordInput = screen.getByPlaceholderText("imb@tman");
    const form = screen.getByRole("form");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith(expect.any(FormData));
    });
  });
});
