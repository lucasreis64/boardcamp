import { create, findAll } from "../controllers/categoriesController.js";
import express from 'express';

const router = express.Router();

router.get("/categories", findAll);
router.post("/categories", create);

export default router;
