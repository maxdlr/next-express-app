import express from "express";
import { investFundModel, loadFixtures } from "../db-config/fixtures.ts";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send();
});

router.get("/fix", (req, res) => {
  res.send(loadFixtures());
});

router.get("/all", async (req, res) => {
  res.send(await investFundModel.find().exec());
});

export default router;
