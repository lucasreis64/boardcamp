import { checkOut, create, deleteOne, findAll } from "../controllers/rentalsController.js";
import express from 'express';

const router = express.Router();

router.post("/rentals", create);
router.get("/rentals", findAll);
router.delete("/rentals/:id", deleteOne)
router.post("/rentals/:id/return", checkOut)

export default router;
