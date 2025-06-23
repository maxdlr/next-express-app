import { InvestFundModel, ValorisationModel } from "../db-config/schema";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface";
import { formatDate } from "./utils";

export const deposit = (req: DepositRequestInterface): string | boolean => {
  try {
    req.allocation.forEach(
      async (allocation: { isin: string; percentage: number }) => {
        const fund = await InvestFundModel.findOne({
          isin: allocation.isin,
        }).exec();

        if (fund) {
          await ValorisationModel.create({
            date: formatDate(new Date()),
            value: req.amount * allocation.percentage,
            investFundIsin: allocation.isin,
          });
        } else {
          return "Can't find fund: " + allocation.isin;
        }
      },
    );
  } catch {
    return false;
  }
  return true;
};
