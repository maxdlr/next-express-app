import mongoose from "mongoose";

export interface Valorisation {
  date: string;
  value: number;
}

export interface InvestFund {
  isin: string;
  fundName: string;
  valorisations: Valorisation[];
}

export const ValorisationSchema = new mongoose.Schema<Valorisation>({
  date: { type: String },
  value: { type: Number },
});

export const InvestFundSchema = new mongoose.Schema<InvestFund>({
  isin: { type: String },
  fundName: { type: String },
  valorisations: { type: [ValorisationSchema] },
});
