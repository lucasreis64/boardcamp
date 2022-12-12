import { connection } from "../db/database.js";

export async function findAll(req, res) {
    try {
        const { rows } = await connection.query("SELECT * FROM categories;");
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

export async function create(req, res) {
    const { name } = req.body;
    try {
        await connection.query("INSERT INTO categories (name) VALUES ($1);", [
            name,
        ]);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
