import { InvestFund, InvestFundModel } from "../db-config/schema";

const findByManyIsins = async (isins: string[]): Promise<InvestFund[]> => {
  return await InvestFundModel.find({ isin: { $in: isins } }).exec();
};

export const InvestFundService = {
  findByManyIsins,
};
