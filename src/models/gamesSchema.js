import Joi from "joi";

export const gamesSchema = Joi.object({
    name: Joi.string().required(),
    stockTotal: Joi.number().min(1).required(),
    pricePerDay: Joi.number().min(1).required(),
    image: Joi.string().uri().required(),
    categoryId: Joi.number().required(),
});
