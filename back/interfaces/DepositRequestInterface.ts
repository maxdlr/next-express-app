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
