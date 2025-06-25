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

const getPartitionData = async (): Promise<
  ApiResponse<PortfolioPartition[]>
> => {
  return await ApiService.get("invest-funds/partition");
};

export const GraphService = { getEvolutionData, getPartitionData };
