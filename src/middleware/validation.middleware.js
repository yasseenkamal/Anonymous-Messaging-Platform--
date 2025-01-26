import Joi from "joi"
import { Types } from "mongoose";


export const validataeObjectId = (value, helper) => {

    return Types.ObjectId.isValid(value)
        ? true
        : helper.message("in-valid odjectId")
}

export const generalFeild = {
    userName: Joi.string().alphanum().case('upper').min(2).max(20).messages({
        'string.min': 'the minimum length of the name is 2',
        'string.empty': 'the name field cannot be empty ',
        'any.required': 'the name field is required',
    }),
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu', 'eg'] } }),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmationPassword: Joi.string().valid(Joi.ref("password")),
    phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    id: Joi.string().custom(validataeObjectId).required(),
    'accept-language': Joi.string().valid("en", "ar")
}


export const validation = (schema) => {
    return (req, res, next) => {

        const inputData = { ...req.body, ...req.params }

        const validationResult = schema.validate(inputData, { abortEarly: false })

        if (validationResult.error) {
            return res.status(400).json({ message: 'validation error', validationResult: validationResult.error.details })
        }


        return next()

    }
}



export const validaion_custom = (schema) => {
    return (req, res, next) => {
        const validationErrors = []
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false });
            if (validationResult.error) {
                validationErrors.push({ key, validationResult: validationResult.error.details })
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({ message: "validation error ", err: validationErrors })
        }

        return next();
    };
};





