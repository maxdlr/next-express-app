import mongoose from "mongoose";

// interfaces

export interface Valorisation {
  date: string;
  value: number;
  investFundIsin: string;
}

export interface InvestFund {
  isin: string;
  fundName: string;
}

export interface Allocation {
  isin: string;
  percentage: number;
  purchasedShare: number;
  transactionId: string;
  allocatedAmount: number;
}

export interface Transaction {
  amount: number;
  date: string;
}

// schemae

export const AllocationSchema = new mongoose.Schema<Allocation>({
  isin: { type: String },
  percentage: { type: Number },
  purchasedShare: { type: Number },
  transactionId: { type: String },
  allocatedAmount: { type: Number },
});

export const TransactionSchema = new mongoose.Schema<Transaction>({
  amount: { type: Number },
  date: { type: String },
});

export const ValorisationSchema = new mongoose.Schema<Valorisation>({
  date: { type: String },
  value: { type: Number },
  investFundIsin: { type: String },
});

export const InvestFundSchema = new mongoose.Schema<InvestFund>({
  isin: { type: String },
  fundName: { type: String },
});

// models

export const AllocationModel = mongoose.model("Allocation", AllocationSchema);

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema,
);

export const ValorisationModel = mongoose.model(
  "Valorisation",
  ValorisationSchema,
);

export const InvestFundModel = mongoose.model("Model", InvestFundSchema);
