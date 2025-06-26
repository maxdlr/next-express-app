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

  return result;
};

export const DatatableService = {
  getAllTransactions,
};
