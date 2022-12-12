export function validateBySchema(object, response, schema) {
    const validation = schema.validate(object, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        response.status(422).send(errors);
        return false;
    }
    return true;
}
