import { connection } from "../db/database.js";
import { customersSchema } from "../models/customersSchema.js";
import { validateBySchema } from "../services/validateBySchema.js";

export async function validateCustomers(req, res, next) {
    const { cpf } = req.body;
    try {
        if (!validateBySchema(req.body, res, customersSchema)) return;

        const isExistentCpf = await connection.query(
            "SELECT * FROM customers WHERE cpf = $1;",
            [cpf]
        );

        if (isExistentCpf.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function validateCostumersUpdate(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params
    try {
        if (!validateBySchema(req.body, res, customersSchema)) return;

        let isExistentCpf = await connection.query(
            "SELECT * FROM customers WHERE cpf = $1;",
            [cpf]
        );
        isExistentCpf = isExistentCpf.rows;

        const thisCpf = isExistentCpf.find((i) => i.id === Number(id));

        if (
            isExistentCpf[0]?.cpf !== thisCpf?.cpf &&
            isExistentCpf.length>0
        ) {
            res.sendStatus(409);
            return;
        }

        else next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
