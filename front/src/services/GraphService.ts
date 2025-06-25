import { ApiResponse, ApiService } from "./ApiService";

export interface PortfolioPartition {
  fundName: string;
  percentage: number;
  value: number;
}

export interface PortfolioEvolutionPoint {
  date: string;
  value: number;
}

const getEvolutionData = async (): Promise<PortfolioEvolutionPoint[]> => {
  const response: ApiResponse<PortfolioEvolutionPoint[]> = await ApiService.get(
    "invest-funds/evolution",
  );
  return response.payload;
};

const getPartitionData = async (): Promise<PortfolioPartition[]> => {
  const response = await ApiService.get("invest-funds/partition");
  const data = response.payload;

  const result = data.forEach((item: PortfolioPartition) => {
    item.value = parseFloat(item.value.toFixed(2));
  });
  return result;
};

export const GraphService = { getEvolutionData, getPartitionData };
