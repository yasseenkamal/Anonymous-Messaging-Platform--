import Joi from "joi";
import { generalFeild } from "../../middleware/validation.middleware.js";



export const sendMessage = Joi.object().keys({
    message: Joi.string().min(5).max(50000).required(),
    recipientId: generalFeild.id.required()
}).required()