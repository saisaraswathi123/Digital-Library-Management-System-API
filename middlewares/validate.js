const Joi = require('joi');

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });
    next();
};

module.exports = validateRequest;
