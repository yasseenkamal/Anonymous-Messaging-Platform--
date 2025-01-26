import Joi from "joi";
import { generalFeild } from "../../middleware/validation.middleware.js";


export const shareProfile = Joi.object().keys({

    userId: generalFeild.id.required()

}).required()

export const updateProfile = Joi.object().keys({

    userName: generalFeild.userName,
    phone: generalFeild.phone,
    DOB: Joi.date().less("now")


}).required()


export const updatePassword = Joi.object().keys({

    oldPassword: generalFeild.password.required(),
    password: generalFeild.password.not(Joi.ref("oldPassword")).required(),
    confirmationPassword: generalFeild.confirmationPassword.valid(Joi.ref("password")).required(),


}).required()