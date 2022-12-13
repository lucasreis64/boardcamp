import { create } from "../controllers/rentalsController.js";
import express from 'express';

const router = express.Router();

router.post("/rentals", create);
/* router.get("/customers", findAll);
router.get("/customers/:id", findById)
router.put("/customers/:id", update) */

export default router;
