import {
  Allocation,
  AllocationModel,
  ValorisationModel,
} from "../db-config/schema";

export const getLatestFundValues = async (
  allocations: Allocation[],
): Promise<Map<string, number>> => {
  const investedIsins = allocations.map((allo: Allocation) => allo.isin);
  const latestFundValues: Map<string, number> = new Map<string, number>();

  for (const isin of investedIsins) {
    const latestValo = await ValorisationModel.findOne({
      investFundIsin: isin,
    })
      .sort({ date: -1 })
      .exec();

    if (latestValo) latestFundValues.set(isin, latestValo.value);
  }
  return latestFundValues;
};

const getTotalInvestedAmount = async (): Promise<number | false> => {
  try {
    let total = 0;
    const allocations = await AllocationModel.find({}).exec();

    if (allocations.length === 0) return 0;

    const latestFundValues = await getLatestFundValues(allocations);

    if (latestFundValues.size === 0) return false;

    for (const allo of allocations) {
      const latestFundValue = latestFundValues.get(allo.isin);
      if (latestFundValue !== undefined) {
        total += allo.purchasedShare * latestFundValue;
      }
    }
    return total;
  } catch (error) {
    return false;
  }
};

export const ConsultationService = {
  getTotalInvestedAmount,
};
