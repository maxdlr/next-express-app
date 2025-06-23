import fs from "fs";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { InvestFundSchema, ValorisationSchema } from "./schema.ts";

const getData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rawData = fs.readFileSync(join(__dirname, "data.json"));

  return JSON.parse(rawData.toString());
};

const hydrate = () => {
  const data = getData();

  data.forEach(async (item) => {
    const investFundModel = mongoose.model("Model", InvestFundSchema);
    const investFundInstance = new investFundModel({
      isin: item.isin,
      fundName: item.fundName,
    });

    const valosInstances = [];

    item.valorisations.forEach(async (valo) => {
      const valorisationModel = mongoose.model(
        "Valorisation",
        ValorisationSchema,
      );
      const valorisationInstance = new valorisationModel({
        date: valo.date,
        value: valo.value,
      });

      await valorisationInstance.save();

      valosInstances.push(valorisationInstance);
    });

    investFundInstance.valorisations = valosInstances;
    await investFundInstance.save();
  });
};

export const loadFixtures = () => {
  hydrate();
};
