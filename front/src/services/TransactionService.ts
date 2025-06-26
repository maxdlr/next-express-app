import { redirect } from "next/navigation";
import { AuthService } from "./AuthService";
import { ApiService } from "./ApiService";

export interface Transaction {
  amount: number;
  date: string;
  userId: string;
  _id: string;
  __v: number;
}

export interface FormattedTransaction {
  id: string;
  date: string;
  amount: number;
}

const getAllTransactions = async (): Promise<FormattedTransaction[]> => {
  const response = await ApiService.get("transactions");
  const data = response.payload;

  const result = data.map((item: Transaction) => {
    item.amount = parseFloat(item.amount.toFixed(2));
    return {
      id: item._id,
      date: item.date,
      amount: item.amount,
    };
  });

  result.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return result;
};

export interface DepositRequestInterface {
  userId: string;
  amount: number;
  bankInfo: {
    rib: string;
    bic: string;
  };
  allocations: {
    isin: string;
    percentage: number;
  }[];
}

const deposit = async (formData: FormData) => {
  const user = AuthService.getCurrentUser();

  if (!user) {
    redirect("/");
  }

  let allocations = [];
  try {
    const allocationsString = formData.get("allocations") as string;
    allocations = allocationsString ? JSON.parse(allocationsString) : [];
  } catch (error) {
    console.error("Error parsing allocations:", error);
    allocations = [];
  }

  const payload: DepositRequestInterface = {
    userId: user.id,
    amount: formData.get("amount") || null,
    bankInfo: {
      rib: formData.get("rib") || null,
      bic: formData.get("bic") || null,
    },
    allocations,
  };

  return await ApiService.post("transactions", payload);
};
export const TransactionService = { deposit, getAllTransactions };
