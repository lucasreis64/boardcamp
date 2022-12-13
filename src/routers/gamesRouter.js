import { create, findAll } from "../controllers/gamesController.js";
import express from 'express';
import { validateGames } from "../middlewares/validateGames.js";

const router = express.Router();

router.get("/games", findAll);
router.post("/games",validateGames, create);

export default router;
