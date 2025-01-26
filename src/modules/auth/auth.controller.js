import * as registrationService from './service/registration.service.js'
import * as loginService from './service/login.service.js';
import { Router } from 'express'
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from "./auth.validation.js"


const router = Router();




router.post("/signup", validation(validators.signup), registrationService.signup)
router.post("/signup-OTP",validation(validators.signup), registrationService.signupWithOTP)
router.patch("/confirm-email", registrationService.confirmEmail)
router.patch("/OTP-confrimation",registrationService.confirmWithOTP)
router.post("/login", validation(validators.login), loginService.login)

export default router     