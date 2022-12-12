import { connection } from "../db/database.js";

export async function findAll(req, res) {
    const { name } = req.query;
    try {
        if (name) {
            const { rows } = await connection.query(
                "SELECT * FROM games WHERE name LIKE $1;",
                [`%${name}%`]
            );

            rows.forEach(async (r, i) => {
                const categoryName = await connection.query(
                    "SELECT name FROM categories WHERE id = $1;",
                    [r.categoryId]
                );
                r.categoryName = categoryName.rows[0].name;
                if (i === rows.length - 1) res.send(rows);
            });
            return;
        }

        const { rows } = await connection.query("SELECT * FROM games;");

        rows.forEach(async (r, i) => {
            const categoryName = await connection.query(
                "SELECT name FROM categories WHERE id = $1;",
                [r.categoryId]
            );
            r.categoryName = categoryName.rows[0].name;
            if (i === rows.length - 1) res.send(rows);
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function create(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
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
        console.log(isExistentName.rows);
        if (isExistentName.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
