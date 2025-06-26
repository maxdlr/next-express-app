import { ApiService } from "./ApiService";

export interface InvestFund {
  fundName: string;
  isin: string;
}

const getAll = async () => {
  const response = await ApiService.get("invest-funds");
  return response.payload;
};
export const InvestFundService = { getAll };
