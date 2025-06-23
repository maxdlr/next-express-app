import fs from "fs";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  InvestFund,
  InvestFundSchema,
  Valorisation,
  ValorisationSchema,
} from "./schema.ts";

export const ValorisationModel = mongoose.model(
  "Valorisation",
  ValorisationSchema,
);
export const investFundModel = mongoose.model("Model", InvestFundSchema);

const getData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rawData = fs.readFileSync(join(__dirname, "data.json"));

  return JSON.parse(rawData.toString());
};

const hydrate = (): boolean => {
  try {
    const investFunds = getData();

    investFunds.forEach(async (item: InvestFund) => {
      const investFundInstance = new investFundModel({
        isin: item.isin,
        fundName: item.fundName,
      });

      const valosInstances = item.valorisations.map((valo: Valorisation) => {
        return new ValorisationModel({
          date: valo.date,
          value: valo.value,
        });
      });
      await ValorisationModel.insertMany(valosInstances);

      investFundInstance.valorisations = valosInstances;
      await investFundInstance.save();
    });
    return true;
  } catch (err) {
    throw new Error("Can't hydrate fixtures - ", err.message);
  }
};

export const loadFixtures = (): boolean => {
  return hydrate();
};
