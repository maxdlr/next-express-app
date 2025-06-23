export interface DepositRequestInterface {
  amount: number;
  bankInfo: {
    rib: string;
    bic: string;
  };
  // fund: ID[];
  allocation: {
    isin: string;
    percentage: number;
  }[];
}
