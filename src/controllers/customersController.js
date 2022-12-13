import { connection } from "../db/database.js";

export async function findAll(req, res) {
    const { cpf } = req.query;
    try {
        if (cpf) {
            const { rows } = await connection.query(
                "SELECT * FROM customers WHERE cpf LIKE $1;",
                [`${cpf}%`]
            );
            
            if (rows.length === 0) return res.sendStatus(404);

            res.send(rows);
            return;
        }

        const { rows } = await connection.query("SELECT * FROM customers;");

        res.send(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function findById(req, res) {
    const { id } = req.params;
    try {
        if (id) {
            const { rows } = await connection.query(
                "SELECT * FROM customers WHERE id = $1;",
                [id]
            );
            if (rows.length === 0) return res.sendStatus(404);
            res.send(rows[0]);
            return;
        }
        res.sendStatus(404);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function create(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function update(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(
            "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
