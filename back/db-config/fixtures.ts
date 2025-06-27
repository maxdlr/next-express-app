import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  Allocation,
  AllocationModel,
  InvestFundModel,
  Transaction,
  TransactionModel,
  User,
  UserModel,
  ValorisationModel,
} from "./schema.ts";
import {
  formatDate,
  randomDate,
  randomFloat,
  randomInt,
} from "../services/utils.ts";
import { EncryptionService } from "../services/EncryptionService.ts";

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

const generateUsers = async () => {
  try {
    const users: User[] = [];
    for (let i = 0; i < 2; i++) {
      const newUser = new UserModel({
        email: `user${i}@email.com`,
        password: await EncryptionService.encrypt("password"),
        username: "user",
      });
      users.push(newUser);
    }
    UserModel.insertMany(users);
  } catch (err) {
    throw new Error("Can't generate users: ", err.message);
  }
};

const generateTransactions = async () => {
  try {
    const isins = getData().map((value: DummyData) => value.isin);
    const users = await UserModel.find().exec();
    const userIds: string[] = users.map((user) => user._id.toString());

    const transactions: Transaction[] = [];
    const allAllocations: Allocation[] = [];

    const numberOfTransactions = randomInt(5, 50);

    for (let i = 0; i < numberOfTransactions; i++) {
      const amount = randomInt(100, 1000);
      const transaction = new TransactionModel({
        userId: userIds[randomInt(0, userIds.length - 1)],
        amount,
        date: formatDate(
          randomDate(
            new Date(),
            new Date(
              new Date().setDate(new Date().getDate() - randomInt(5, 50)),
            ),
          ),
        ),
      });

      const shuffledIsins = isins.sort(() => 0.5 - Math.random());
      const selectedIsins = shuffledIsins.slice(
        0,
        randomInt(2, Math.min(5, isins.length)),
      );

      const weights = selectedIsins.map(() => randomFloat(0.1, 1));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);

      const transactionAllocations: Allocation[] = [];

      for (let j = 0; j < selectedIsins.length; j++) {
        const isin = selectedIsins[j];
        const percentage = weights[j] / totalWeight; // ensures total = 1

        const currentFundValue = await ValorisationModel.findOne({
          investFundIsin: isin,
        })
          .sort({ date: -1 })
          .exec();

        const allocatedAmount = amount * percentage;
        const purchasedShare = allocatedAmount / (currentFundValue?.value || 1);

        transactionAllocations.push(
          new AllocationModel({
            isin,
            percentage,
            allocatedAmount,
            purchasedShare,
            transactionId: transaction._id.toString(),
          }),
        );
      }

      allAllocations.push(...transactionAllocations);
      transactions.push(transaction);
    }

    await AllocationModel.insertMany(allAllocations);
    await TransactionModel.insertMany(transactions);
  } catch (err: any) {
    throw new Error("Can't generate transactions: " + err.message);
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
  await generateUsers();
  await hydrateData();
  await generateTransactions();
};
