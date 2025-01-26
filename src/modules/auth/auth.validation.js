import Joi from "joi";
import { generalFeild } from "../../middleware/validation.middleware.js";



export const signup = Joi.object().keys({

    userName: generalFeild.userName.required(),
    email: generalFeild.email.required(),
    password: generalFeild.password.required(),
    confirmationPassword: generalFeild.confirmationPassword.valid(Joi.ref("password")).required(),
    phone: generalFeild.phone,


}).required().options({ allowUnknown: false })



export const signup_custom = {
    body: Joi.object().keys({

        userName: Joi.string().alphanum().case('upper').min(2).max(20).required(),
        email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } }).required(),
        password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        confirmationPassword: Joi.string().valid(Joi.ref("password")).required(),
        phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),

    }).required().options({ allowUnknown: false }),

    params: Joi.object().keys({

        id: Joi.boolean().required()


    }).required().options({ allowUnknown: false }),

    Headers: Joi.object().keys({

        'accept-language': Joi.string().valid("en", "ar")


    }).required().options({ allowUnknown: true })
}




export const login = Joi.object().keys({

    email: generalFeild.email.required(),
    password: generalFeild.password.required(),

}).required().options({ allowUnknown: false })



