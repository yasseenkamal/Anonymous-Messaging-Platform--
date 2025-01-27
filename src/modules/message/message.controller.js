import { Router } from "express";
import { sendMessage } from "./service/message.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './message.validation.js';

const router = Router()

router.post("/",validation(validators.sendMessage),sendMessage)


export default router    