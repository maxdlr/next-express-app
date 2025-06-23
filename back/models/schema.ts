import mongoose from "mongoose";

export const ValorisationSchema = new mongoose.Schema({
  date: String,
  value: Number,
});

export const InvestFundSchema = new mongoose.Schema({
  isin: String,
  fundName: String,
  valorisations: [ValorisationSchema],
});
