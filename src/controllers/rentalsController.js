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
            'SELECT "stockTotal" FROM games WHERE id = $1;',
            [gameId]
        );

        const rentTotal = await connection.query(
            'SELECT * FROM rentals WHERE "gameId" = $1',
            [gameId]
        );

        if (
            stockTotal.rows[0]?.stockTotal &&
            stockTotal.rows[0].stockTotal - rentTotal.rows.length > 0
        )
            avaiable = true;

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

export async function findAll(req, res) {
    const { customerId, gameId } = req.query;
    const game = {};
    const customer = {};
    let rentals = [];

    try {
        if (customerId && gameId) {
            rentals = await connection.query(
                'SELECT * FROM rentals WHERE "customerId"=$1 AND "gameId"=$2;',
                [customerId, gameId]
            );
            if (rentals.rows.length === 0) return res.sendStatus(404);
        } else if (customerId) {
            rentals = await connection.query(
                'SELECT * FROM rentals WHERE "customerId"=$1;',
                [customerId]
            );
            if (rentals.rows.length === 0) return res.sendStatus(404);
        } else if (gameId) {
            rentals = await connection.query(
                'SELECT * FROM rentals WHERE "gameId"=$1;',
                [gameId]
            );
            if (rentals.rows.length === 0) return res.sendStatus(404);
        } else {
            rentals = await connection.query("SELECT * FROM rentals");
            if (rentals.rows.length === 0) return res.sendStatus(404);
        }

        rentals = rentals.rows;

        rentals.forEach(async (r, i) => {
            await customerObj(r);
            await gameObj(r);
            if (rentals.length - 1 === i) res.send(rentals);
        });

        async function gameObj(rentals) {
            const id = rentals.gameId;
            const { rows } = await connection.query(
                "SELECT * FROM games WHERE id = $1",
                [id]
            );
            if (rows.length === 0) return res.sendStatus(404);

            const categoryName = await connection.query(
                "SELECT name FROM categories WHERE id = $1;",
                [rows[0].categoryId]
            );
            if (categoryName.length === 0) return res.sendStatus(404);

            rows[0].categoryName = categoryName.rows[0].name;

            rentals.game = {
                id: rows[0].id,
                name: rows[0].name,
                categoryId: rows[0].categoryId,
                categoryName: rows[0].categoryName,
            };
        }

        async function customerObj(rentals) {
            const id = rentals.customerId;

            const { rows } = await connection.query(
                "SELECT * FROM customers WHERE id = $1;",
                [id]
            );
            if (rows.length === 0) return res.sendStatus(404);

            rentals.customer = { id: rows[0].id, name: rows[0].name };
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}

export async function deleteOne(req, res) {
    const { id } = req.params;

    const { rows } = await connection.query(
        "SELECT * FROM rentals WHERE id = $1;",
        [id]
    );

    if (rows.length === 0) return res.sendStatus(404);
    if (!rows[0].returnDate) return res.sendStatus(400);

    await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
    res.sendStatus(200);
}

export async function checkOut(req, res) {
    const { id } = req.params;

    const { rows } = await connection.query(
        "SELECT * FROM rentals WHERE id = $1;",
        [id]
    );
    console.log(rows.length);
    if (rows.length === 0) return res.sendStatus(404);
    if (rows[0].returnDate) return res.sendStatus(400);

    rows[0].returnDate = dayjs().format("YYYY-MM-DDT00:00:00.000Z");

    let { returnDate, rentDate, delayFee, daysRented, originalPrice } = rows[0];

    returnDate = new Date(returnDate);
    rentDate = new Date(rentDate);

    const diffMs = returnDate - rentDate;
    const diffSec = diffMs / 1000;
    const diffMin = diffSec / 60;
    const diffHours = diffMin / 60;
    const diffDays = diffHours / 24;

    console.log(returnDate, rentDate, diffDays);

    if (diffDays - daysRented > 0)
        delayFee = (diffDays - daysRented) * (originalPrice / daysRented);
    else delayFee = 0

    await connection.query(
        'UPDATE rentals SET "delayFee"=$1, "returnDate"=$2 WHERE id = $3;',
        [delayFee, returnDate, id]
    );

    res.sendStatus(200)
}
