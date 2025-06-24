import express from "express";
import { loadFixtures } from "../db-config/fixtures.ts";
import { TransactionService } from "../services/TransactionService.ts";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface.ts";
import {
  AllocationModel,
  InvestFundModel,
  ValorisationModel,
} from "../db-config/schema.ts";
import { ApiResponse } from "../interfaces/ApiResponse.ts";
import { ValorisationService } from "../services/ValorisationService.ts";
import { ConsultationService } from "../services/ConsultationService.ts";
const router = express.Router();

// fixtures

router.get("/fixtures", async (req, res) => {
  await loadFixtures();
  res.send(new ApiResponse().asSuccess("Data written in db"));
});

// invest funds

router.get("/invest-funds", async (req, res) => {
  const response = new ApiResponse(
    await InvestFundModel.find().exec(),
  ).asSuccess();
  res.status(response.statusCode).send(response);
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

// valo

router.get("/valorisations", async (req, res) => {
  const response = new ApiResponse(
    await ValorisationModel.find().exec(),
  ).asSuccess();
  res.status(response.statusCode).send(response);
});

router.get("/valorisations/:investFundIsin", async (req, res) => {
  const response = await ValorisationService.findByIsin(
    req.params["investFundIsin"],
  );
  res.status(response.statusCode).send(response);
});

router.post("/valorisations", async (req, res) => {
  const deposited: ApiResponse = await TransactionService.deposit(
    req.body as DepositRequestInterface,
  );
  res.status(deposited.statusCode).send(deposited);
});

// allo

router.get("/allocations", async (req, res) => {
  res.send(await AllocationModel.find({}).exec());
});

export default router;
