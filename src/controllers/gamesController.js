import { connection } from "../db/database.js";

export async function findAll(req, res) {
    const { name } = req.query;
    try {
        if (name) {
            const { rows } = await connection.query(
                "SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1);",
                [`${name}%`]
            );
            if ((rows.length === 0)) return res.sendStatus(404);

            rows.forEach(async (r, i) => {
                const categoryName = await connection.query(
                    "SELECT name FROM categories WHERE id = $1;",
                    [r.categoryId]
                );
                r.categoryName = categoryName.rows[0].name;

                if (i === rows.length - 1)  return res.send(rows);   
            });
            return
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
