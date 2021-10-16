const joi = require("joi");

exports.singUpValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(36).required(),
});

exports.singInValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(36).required(),
    code: joi.string().min(24).max(24).required(),
});
