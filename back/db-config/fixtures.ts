import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { InvestFundModel, ValorisationModel } from "./schema.ts";

const getData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rawData = fs.readFileSync(join(__dirname, "data.json"));

  return JSON.parse(rawData.toString());
};

const hydrate = (): boolean => {
  try {
    const investFunds = getData();

    investFunds.forEach(
      async (item: {
        isin: string;
        fundName: string;
        valorisations: {
          date: string;
          value: number;
        }[];
      }) => {
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

        // investFundInstance.valorisations = valosInstances;
        await investFundInstance.save();
      },
    );
    return true;
  } catch (err) {
    throw new Error("Can't hydrate fixtures - ", err.message);
  }
};

export const loadFixtures = (): boolean => {
  return hydrate();
};
