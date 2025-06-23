import express from "express";
import { loadFixtures } from "../models/fixtures.ts";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send(loadFixtures());
});

router.get("/fix", (req, res) => {
  loadFixtures();
  res.send("done");
});

export default router;
