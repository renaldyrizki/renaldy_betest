import Joi from "joi";

const registerUserValidation = Joi.object({
    userName: Joi.string().min(5).max(50).required(),
    pin: Joi.string().pattern(/^\d+$/).length(6).required(),
    accountNumber: Joi.string().min(10).max(20).pattern(/^\d+$/).required(),
    emailAddress: Joi.string().email().max(100).required(),
    identityNumber: Joi.string().length(16).pattern(/^\d+$/).required()
});

const loginUserValidation = Joi.object({
    userName: Joi.string().min(5).max(50).required(),
    pin: Joi.string().length(6).pattern(/^\d+$/).required()
});

const getUserValidation = Joi.string().required();

const getUserValidationByIdentityNumber = Joi.string().length(16).pattern(/^\d+$/).required();

const getUserValidationByAccountNumber = Joi.string().min(10).max(20).pattern(/^\d+$/).required();


const updateUserValidation = Joi.object({
    id: Joi.string().required(),
    userName: Joi.string().min(5).max(50).optional(),
    pin: Joi.string().length(6).optional(),
    accountNumber: Joi.string().min(10).max(20).pattern(/^\d+$/).optional(),
    emailAddress: Joi.string().email().max(100).optional(),
    identityNumber: Joi.string().length(16).pattern(/^\d+$/).optional()
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    getUserValidationByIdentityNumber,
    getUserValidationByAccountNumber,
    updateUserValidation
}
