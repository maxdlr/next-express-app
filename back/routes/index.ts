import express from "express";
import { loadFixtures } from "../db-config/fixtures.ts";
import { deposit } from "../services/InvestFundService.ts";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface.ts";
import { InvestFundModel, ValorisationModel } from "../db-config/schema.ts";
const router = express.Router();

router.get("/fixtures", (req, res) => {
  res.send(loadFixtures());
});

router.get("/invest-funds", async (req, res) => {
  res.send(await InvestFundModel.find().exec());
});

router.get("/valorisations", async (req, res) => {
  res.send(await ValorisationModel.find().exec());
});

router.get("/valorisations/:investFundIsin", async (req, res) => {
  res.send(
    await ValorisationModel.find({
      investFundIsin: req.params["investFundIsin"],
    }).exec(),
  );
});

router.post("/valorisations", async (req, res) => {
  res.send(deposit(req.body as DepositRequestInterface));
});

export default router;
