import express from "express";
import { loadFixtures } from "../db-config/fixtures.ts";
import { deposit } from "../services/InvestFundService.ts";
import { DepositRequestInterface } from "../interfaces/DepositRequestInterface.ts";
import { InvestFundModel, ValorisationModel } from "../db-config/schema.ts";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send();
});

router.get("/fixtures", (req, res) => {
  res.send(loadFixtures());
});

router.get("/invest-funds", async (req, res) => {
  res.send(await InvestFundModel.find().exec());
});

router.post("/invest-funds", async (req, res) => {
  res.send(deposit(req.body as DepositRequestInterface));
});

router.get("/valorisations", async (req, res) => {
  res.send(await ValorisationModel.find().exec());
});

export default router;
