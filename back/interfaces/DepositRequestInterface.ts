export interface DepositRequestInterface {
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
