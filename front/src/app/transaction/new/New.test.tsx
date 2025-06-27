import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import New from "./page";
import { TransactionService } from "@/services/TransactionService";

beforeAll(() => {
  HTMLFormElement.prototype.requestSubmit = function () {
    this.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  };
});

jest.spyOn(TransactionService, "deposit").mockResolvedValue({
  statusCode: 200,
  message: "Success",
});

jest.mock("@/services/InvestFundService", () => ({
  InvestFundService: {
    getAll: jest.fn().mockResolvedValue([
      { isin: "ISINFUND1", fundName: "Test Fund 1" },
      { isin: "ISINFUND2", fundName: "Test Fund 2" },
    ]),
  },
}));

jest.mock("@/services/TransactionService", () => ({
  TransactionService: {
    deposit: jest.fn().mockResolvedValue({
      statusCode: 200,
      message: "Success",
    }),
  },
}));

jest.mock("@/components/auth-provider", () => ({
  ProtectedRoute: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/button/button", () => {
  const MockButton = ({ label, disabled }: any) => (
    <button disabled={disabled} data-testid="submit-btn">
      {label}
    </button>
  );
  MockButton.displayName = "MockButton";
  return MockButton;
});

jest.mock("@/components/input/input", () => {
  const MockInput = ({ name, onChange }: any) => (
    <input data-testid={`input-${name}`} onChange={onChange} />
  );
  MockInput.displayName = "MockInput";
  return MockInput;
});

jest.mock("@/components/input/dropdown", () => {
  const MockDropdown = ({ onChange, options }: any) => (
    <select
      data-testid="funds-dropdown"
      onChange={(e) => onChange([e.target.value])}
    >
      <option value="">Select</option>
      {options.map((opt: any) => (
        <option key={opt.isin} value={opt.isin}>
          {opt.fundName}
        </option>
      ))}
    </select>
  );
  MockDropdown.displayName = "MockDropdown";
  return MockDropdown;
});

jest.mock("@/components/loader/loader", () => {
  const MockLoader = () => <div data-testid="loader">Loading...</div>;
  MockLoader.displayName = "MockLoader";
  return MockLoader;
});

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => <div />,
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("New Component", () => {
  test("renders and loads funds", async () => {
    render(<New />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("input-amount")).toBeInTheDocument();
    expect(screen.getByTestId("input-rib")).toBeInTheDocument();
    expect(screen.getByTestId("input-bic")).toBeInTheDocument();
    expect(screen.getByTestId("funds-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  test("calculates allocation amounts", async () => {
    render(<New />);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("input-amount"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByTestId("funds-dropdown"), {
      target: { value: "ISINFUND1" },
    });

    await waitFor(() => {
      const fundHeaders = screen.getAllByText("Test Fund 1");
      expect(fundHeaders[0]).toBeInTheDocument();
    });
  });

  test("submits form successfully", async () => {
    render(<New />);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Purchase"));

    await waitFor(() => {
      expect(TransactionService.deposit).toHaveBeenCalled();
    });
  });
});
