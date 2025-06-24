import {
  Allocation,
  AllocationModel,
  InvestFund,
  Valorisation,
  ValorisationModel,
} from "../db-config/schema";
import { InvestFundService } from "./InvestFundService";
import { TransactionService } from "./TransactionService";
import { formatDate } from "./utils";
import { ValorisationService } from "./ValorisationService";

export interface PortfolioEvolutionPoint {
  date: string;
  value: number;
}

export interface PortfolioPartition {
  fundName: string;
  percentage: number;
  value: number;
}

const findLatestFundValues = async (
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

    const latestFundValues = await findLatestFundValues(allocations);

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

const getPortfolioEvolution = async (): Promise<
  PortfolioEvolutionPoint[] | false
> => {
  try {
    const allocations = await AllocationModel.find().exec();

    if (allocations.length === 0) {
      return false;
    }

    const investedIsins = allocations.map((allo: Allocation) => allo.isin);
    const valorisationsOfInvestedFunds =
      await ValorisationService.findByManyIsins(investedIsins);

    if (valorisationsOfInvestedFunds.length === 0) {
      return false;
    }

    const firstTransaction = await TransactionService.findFirst();
    const startDate = firstTransaction
      ? new Date(firstTransaction.date)
      : new Date(new Date(valorisationsOfInvestedFunds[0].date));

    const evolution: PortfolioEvolutionPoint[] = [];

    const currentDate = new Date(startDate);
    const now = new Date();

    while (currentDate <= now) {
      let value = 0;

      for (const allo of allocations) {
        const valo = valorisationsOfInvestedFunds
          .filter(
            (v: Valorisation) =>
              v.investFundIsin === allo.isin && new Date(v.date) <= currentDate,
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .at(0);

        if (valo) {
          value += allo.purchasedShare * valo.value;
        }
      }

      evolution.push({
        date: formatDate(currentDate),
        value: parseFloat(value.toFixed(2)),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return evolution;
  } catch (error) {
    return false;
  }
};

const getPortfolioPartition = async (): Promise<
  PortfolioPartition[] | false
> => {
  const allocations = await AllocationModel.find().exec();

  if (allocations.length === 0) {
    return false;
  }

  const fundValues = new Map<string, number>();
  const fundNames = new Map<string, string>();

  const isins = allocations.map((allo: Allocation) => allo.isin);
  const valos: Map<string, number> =
    await ValorisationService.findAllLatests(isins);
  const funds = await InvestFundService.findByManyIsins(isins);

  funds.forEach((fund: InvestFund) => fundNames.set(fund.isin, fund.fundName));

  let totalValue = 0;
  for (const allo of allocations) {
    const isin = allo.isin;
    const latestValue = valos.get(isin);

    if (latestValue !== undefined) {
      const currentAmount = allo.purchasedShare * latestValue;
      totalValue += currentAmount;
      fundValues.set(isin, (fundValues.get(isin) || 0) + currentAmount);
    }
  }

  if (totalValue === 0) return [];

  const result: PortfolioPartition[] = [];

  for (const [isin, value] of fundValues.entries()) {
    const percentage: number = value / totalValue;
    result.push({
      fundName: fundNames.get(isin) || isin,
      percentage,
      value,
    });
  }
  return result;
};

export const ConsultationService = {
  getTotalInvestedAmount,
  getPortfolioEvolution,
  getPortfolioPartition,
};
