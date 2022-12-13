import { connection } from "../db/database.js";
import { categoriesSchema } from "../models/categoriesSchema.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateCategories(req, res, next) {
    try {
        if (!validateBySchema(req.body, res, categoriesSchema)) return;

        const { name } = req.body;

        const isExistentName = await connection.query(
            "SELECT * FROM categories WHERE name = $1;",
            [name]
        );

        if (isExistentName.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        else next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
