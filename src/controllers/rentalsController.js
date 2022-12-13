import dayjs from "dayjs";
import { connection } from "../db/database.js";

export async function create(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = dayjs().format("YYYY-MM-DD");

    let avaiable = false;

    try {
        const isExistentCustomerId = await connection.query(
            "SELECT * FROM customers WHERE id = $1;",
            [customerId]
        );

        const isExistentGameId = await connection.query(
            "SELECT * FROM games WHERE id = $1;",
            [gameId]
        );

        const stockTotal = await connection.query(
            "SELECT \"stockTotal\" FROM games WHERE id = $1;",
            [gameId]
        );

        const rentTotal = await connection.query(
            "SELECT * FROM rentals WHERE \"gameId\" = $1",
            [gameId]
        );

        if (stockTotal.rows[0]?.stockTotal && stockTotal.rows[0].stockTotal - rentTotal.rows.length > 0) avaiable = true;

        if (
            isExistentCustomerId.rows.length === 0 ||
            isExistentGameId.rows.length === 0 ||
            daysRented <= 0 ||
            !avaiable
        ) {
            res.sendStatus(400);
            return;
        }

        const originalPrice = isExistentGameId.rows[0].pricePerDay * daysRented;

        await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented","rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                customerId,
                gameId,
                daysRented,
                rentDate,
                originalPrice,
                null,
                null,
            ]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
