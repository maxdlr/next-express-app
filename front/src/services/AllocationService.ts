import { ApiService } from "./ApiService";

export interface Allocation {
  _id: string;
  isin: string;
  percentage: number;
  purchasedShare: number;
  transactionId: string;
  allocatedAmount: number;
  __v: number;
}

const getAllByTransactionId = async (id: string) => {
  const response = await ApiService.get("allocations/" + id);
  return response.payload;
};
export const AllocationService = { getAllByTransactionId };
