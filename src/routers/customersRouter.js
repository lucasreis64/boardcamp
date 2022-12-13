import { create, findAll, findById, update } from "../controllers/customersController.js";
import express from 'express';
import { validateCostumersUpdate, validateCustomers } from "../middlewares/validateCustomers.js";

const router = express.Router();

router.get("/customers", findAll);
router.post("/customers", validateCustomers, create);
router.get("/customers/:id", findById)
router.put("/customers/:id",validateCostumersUpdate, update)

export default router;
