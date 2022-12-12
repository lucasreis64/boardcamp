import { create, findAll, findById, update } from "../controllers/customersController.js";
import express from 'express';

const router = express.Router();

router.get("/customers", findAll);
router.post("/customers", create);
router.get("/customers/:id", findById)
router.put("/customers/:id", update)

export default router;
