import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  Allocation,
  AllocationModel,
  InvestFundModel,
  Transaction,
  TransactionModel,
  ValorisationModel,
} from "./schema.ts";
import {
  formatDate,
  randomDate,
  randomFloat,
  randomInt,
} from "../services/utils.ts";

export interface DummyData {
  isin: string;
  fundName: string;
  valorisations: { date: string; value: number }[];
}

const getData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rawData = fs.readFileSync(join(__dirname, "data.json"));

  return JSON.parse(rawData.toString());
};

const generateTransactions = async () => {
  try {
    const isins = getData().map((value: DummyData) => value.isin);

    const allocations: Allocation[] = [];
    isins.forEach((isin: string, index: number) => {
      if (index % randomInt(1, 3) === 0) {
        allocations.push(
          new AllocationModel({
            isin,
            percentage: randomFloat(0.1, 0.9),
          }),
        );
      }
    });

    const transactions: Transaction[] = [];
    for (let i = 0; i < randomInt(5, 20); i++) {
      const amount = randomInt(100, 300);
      const transaction = new TransactionModel({
        amount,
        date: formatDate(
          randomDate(
            new Date(),
            new Date(new Date().setDate(new Date().getDate() + 10)),
          ),
        ),
      });

      for (const allo of allocations) {
        const currentFundValue = await ValorisationModel.findOne({
          investFundIsin: allo.isin,
        })
          .sort({ date: -1 })
          .exec();

        const allocatedAmount = amount * allo.percentage;
        const purchasedShare = allocatedAmount / currentFundValue?.value;

        allo.purchasedShare = purchasedShare;
        allo.allocatedAmount = allocatedAmount;
        allo.transactionId = transaction._id.toString();
      }

      transactions.push(transaction);
    }
    await AllocationModel.insertMany(allocations);
    await TransactionModel.insertMany(transactions);
  } catch (err) {
    throw new Error("Can't generate transactions: ", err.message);
  }
};

const hydrateData = async (): Promise<boolean> => {
  try {
    const investFunds = getData();

    for (const item of investFunds) {
      const investFundInstance = new InvestFundModel({
        isin: item.isin,
        fundName: item.fundName,
      });

      const valosInstances = item.valorisations.map(
        (valo: { date: string; value: number }) => {
          return new ValorisationModel({
            date: valo.date,
            value: valo.value,
            investFundIsin: item.isin,
          });
        },
      );
      await ValorisationModel.insertMany(valosInstances);
      await investFundInstance.save();
    }
    return true;
  } catch (err) {
    throw new Error("Can't hydrate fixtures - ", err.message);
  }
};

export const loadFixtures = async () => {
  await hydrateData();
  await generateTransactions();
};
