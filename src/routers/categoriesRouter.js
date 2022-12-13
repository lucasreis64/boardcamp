import express from 'express';
import { create, findAll } from "../controllers/categoriesController.js";
import { validateCategories } from '../middlewares/validateCategories.js';

const router = express.Router();

router.get("/categories", findAll);
router.post("/categories", validateCategories, create);

export default router;
