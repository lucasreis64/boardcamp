import { connection } from "../db/database.js";
import { gamesSchema } from "../models/gamesSchema.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateGames(req, res, next) {
    try {
        if (!validateBySchema(req.body, res, gamesSchema)) return;

        const { name, categoryId } = req.body;

        const isExistentId = await connection.query(
            'SELECT * FROM categories WHERE "id" = $1;',
            [categoryId]
        );

        if (isExistentId.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        const isExistentName = await connection.query(
            "SELECT * FROM games WHERE name = $1;",
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
