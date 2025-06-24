import express from "express";
import { loadFixtures } from "../db-config/fixtures.ts";
import { TransactionService } from "../services/TransactionService.ts";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface.ts";
import {
  AllocationModel,
  InvestFundModel,
  ValorisationModel,
  TransactionModel,
} from "../db-config/schema.ts";
import { ApiResponse } from "../interfaces/ApiResponse.ts";
import { ValorisationService } from "../services/ValorisationService.ts";
import { ConsultationService } from "../services/ConsultationService.ts";
const router = express.Router();

// fixtures

router.get("/fixtures", async (req, res) => {
  await loadFixtures();
  res.send(new ApiResponse().asSuccess("Fixtures written in db"));
});

// funds

router.get("/invest-funds", async (req, res) => {
  res.send(new ApiResponse(await InvestFundModel.find().exec()).asSuccess());
});

router.get("/invest-funds/total", async (req, res) => {
  const total = await ConsultationService.getTotalInvestedAmount();

  if (total === false) {
    const badResponse: ApiResponse = new ApiResponse().asNotFound(
      "Can't total, no investment found",
    );
    res.status(badResponse.statusCode).send(badResponse);
    return;
  }

  const response = new ApiResponse(total).asSuccess(
    "Total money successfully calculated",
  );
  res.status(response.statusCode).send(response);
});

router.get("/invest-funds/evolution", async (req, res) => {
  const evolution = await ConsultationService.getPortfolioEvolution();

  if (!evolution) {
    const notFoundResponse: ApiResponse = new ApiResponse().asNotFound(
      "No data found",
    );
    res.status(notFoundResponse.statusCode).send(notFoundResponse);
    return;
  }

  const response = new ApiResponse(evolution).asSuccess(
    "Evolution successfully retrieved",
  );

  res.status(response.statusCode).send(response);
});

router.get("/invest-funds/partition", async (req, res) => {
  const partition = await ConsultationService.getPortfolioPartition();

  if (!partition) {
    const notFoundResponse: ApiResponse = new ApiResponse().asNotFound(
      "No data found",
    );
    res.status(notFoundResponse.statusCode).send(notFoundResponse);
    return;
  }

  const response = new ApiResponse(partition).asSuccess(
    "Partition successfully retrieved",
  );

  res.status(response.statusCode).send(response);
});

// valo

router.get("/valorisations", async (req, res) => {
  res.send(new ApiResponse(await ValorisationModel.find().exec()).asSuccess());
});

router.get("/valorisations/:investFundIsin", async (req, res) => {
  const isin = req.params["investFundIsin"];
  const valorisations = await ValorisationService.findByIsin(isin);

  if (!valorisations) {
    const badRequestResponse = new ApiResponse().asNotFound(
      "Can't find invest funds with isin: " + isin,
    );
    res.status(badRequestResponse.statusCode).send(badRequestResponse);
    return;
  }

  const response = new ApiResponse(valorisations).asSuccess(
    "Valorisations retrieved successfully",
  );
  res.status(response.statusCode).send(response);
});

// transactions

router.get("/transactions", async (req, res) => {
  res.send(new ApiResponse(await TransactionModel.find().exec()).asSuccess());
});

router.post("/transactions", async (req, res) => {
  const deposited: ApiResponse = await TransactionService.deposit(req.body);
  res.status(deposited.statusCode).send(deposited);
});

// allo

router.get("/allocations", async (req, res) => {
  res.send(new ApiResponse(await AllocationModel.find().exec()).asSuccess());
});

export default router;
