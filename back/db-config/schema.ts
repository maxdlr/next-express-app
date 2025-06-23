import mongoose from "mongoose";

export interface Valorisation {
  date: string;
  value: number;
  investFundIsin: string;
}

export interface InvestFund {
  isin: string;
  fundName: string;
  // valorisations: Valorisation[];
}

export const ValorisationSchema = new mongoose.Schema<Valorisation>({
  date: { type: String },
  value: { type: Number },
  investFundIsin: { type: String },
});

export const InvestFundSchema = new mongoose.Schema<InvestFund>({
  isin: { type: String },
  fundName: { type: String },
  // valorisations: { type: [ValorisationSchema] },
});

export const ValorisationModel = mongoose.model(
  "Valorisation",
  ValorisationSchema,
);

export const InvestFundModel = mongoose.model("Model", InvestFundSchema);
