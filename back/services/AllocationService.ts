import { Types } from "mongoose";
import {
  InvestFundModel,
  ValorisationModel,
  AllocationModel,
} from "../db-config/schema";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface";

const validateAllocationRequest = (
  allocations: DepositRequestInterface["allocations"],
): boolean => {
  const totalPercentage: number = allocations.reduce(
    (acc: number, value: { isin: string; percentage: number }) => {
      acc += value.percentage;
      return acc;
    },
    0 as number,
  );

  return totalPercentage === 1;
};

const allocate = async (
  amount: number,
  allocations: DepositRequestInterface["allocations"],
  transactionId: Types.ObjectId,
): Promise<string | true> => {
  const newAllocations: any[] = [];
  for (const allo of allocations) {
    const fund = await InvestFundModel.findOne({ isin: allo.isin });

    if (!fund) return "Can't find fund with isin: " + allo.isin;

    const currentFundValue = await ValorisationModel.findOne({
      investFundIsin: allo.isin,
    })
      .sort({ date: -1 })
      .exec();

    if (!currentFundValue) {
      return "No valorisation found for fund: " + allo.isin;
    }

    const allocatedAmount = amount * allo.percentage;
    const purchasedShare = allocatedAmount / currentFundValue.value;

    newAllocations.push(
      new AllocationModel({
        isin: allo.isin,
        percentage: allo.percentage,
        transactionId,
        purchasedShare,
        allocatedAmount,
      }),
    );
  }

  await AllocationModel.insertMany(newAllocations);
  return true;
};

export const AllocationService = {
  validateAllocationRequest,
  allocate,
};
