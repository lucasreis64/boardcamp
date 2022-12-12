import { create, findAll } from "../controllers/gamesController.js";
import express from 'express';

const router = express.Router();

router.get("/games", findAll);
router.post("/games", create);

export default router;
