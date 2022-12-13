import Joi from "joi";

export const customersSchema = Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string().pattern(/^\d+$/).min(11).max(11).required(),
    phone: Joi.string().pattern(/^\d+$/).max(11).min(10).required(),
    birthday: Joi.date().required(),
});
