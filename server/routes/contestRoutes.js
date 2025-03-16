import express from "express";
import { saveContestsToDB } from "../controllers/contestController.js";

const router = express.Router();

router.post("/save", saveContestsToDB);

export default router;
