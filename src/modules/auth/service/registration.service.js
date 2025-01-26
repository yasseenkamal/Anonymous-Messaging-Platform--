import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { generateHash } from "../../../utils/security/hash.js";
import { verifyToken } from "../../../utils/security/token.js";
import { generateEncryption } from "../../../utils/security/encryption.js";
import { sendEmail } from "../../../utils/email/send.email.js";
import jwt from 'jsonwebtoken';
import { confirmEmailTemplate } from "../../../utils/template/confirmEmail.js";
import { comparHash } from "../../../utils/security/hash.js";
export const signup = asyncHandler(

    async (req, res, next) => {

        const { userName, email, password, phone, confirmationPassword } = req.body;

        if (password !== confirmationPassword) {
            return next(new Error("password !== confirmationPassword", { cause: 400 }))
        }

        if (await userModel.findOne({ email })) {
            return next(new Error('Email exist', { cause: 409 }))
        }

        const hashPassword = generateHash({ plaintext: password, salt: 10 })
        const encryptPhone = generateEncryption({ plaintext: phone, signature: process.env.ENCRYPTION_SIGNATURE })
        const user = await userModel.create({ userName, email, password: hashPassword, phone: encryptPhone })
        const emailToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SIGNATURE)
        const emaillink = `${process.env.FE_URL}/confirm-email/${emailToken}`
        const html = confirmEmailTemplate({ link: emaillink })
        await sendEmail({ to: email, subject: "confirm email", html })
        if (!email) {
            throw new Error("Email is required to send confirmation email.");
        }


         emailEvent.emit('sendConfirnmEmail', { email })


         return successResponse({ res, message: "Done", data: { user }, status: 201 })

    }

)



export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new Error('Authorization header is missing', { cause: 401 }));
    }

    const [bearer, token] = authorization.split(" ");

    if (!bearer || bearer.toLowerCase() !== "bearer" || !token) {
        return next(new Error('Invalid token format. Use Bearer <token>', { cause: 401 }));
    }

    try {

        const decoded = verifyToken({ token, signature: process.env.EMAIL_TOKEN_SIGNATURE });

        const user = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { confirmEmail: true },
            { new: true }
        );
        if (!user) {
            return next(new Error('User not found', { cause: 404 }));
        }


        return successResponse({ res, message: 'Email confirmed successfully', data: { user } });
    } catch (error) {
        return next(new Error('Invalid or expired token', { cause: 401 }));
    }
});
 

export const signupWithOTP = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, phone, confirmationPassword, role } = req.body;
        if (await userModel.findOne({ email })) {
            return next(new Error('email exist', { cause: 409 }))
        }
        const hashPassword = generateHash({ plaintext: password, salt: 10 })
        const encryptPhone = generateEncryption({ plaintext: phone, signature: process.env.ENCRYPTION_SIGNATURE })
        const user = await userModel.create({ userName, email, password: hashPassword, phone: encryptPhone, role })
        emailEvent.emit('sendConfirmEmail', { email })
        return successResponse({ res, message: ' OTP sent to your mail', data: { user }, status: 201 })

    }
)
     
export const confirmWithOTP = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;

    console.log("Received Email:", email);
    console.log("Input Code:", code);

    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error('Invalid account', { cause: 404 }));
    }
    if (user.confirmEmail) {
        return next(new Error('Already verified', { cause: 409 }));
    }

    console.log("Stored OTP Hash:", user.confirmEmailOtp);

    const isValidCode = comparHash({ plaintext: code, hashValue: user.confirmEmailOtp });
    console.log("Is Valid Code:", isValidCode);

    if (!isValidCode) {
        return next(new Error('Invalid code', { cause: 400 }));
    }

    const userResult = await userModel.findOneAndUpdate(
        { email },
        { confirmEmail: true, $unset: { confirmEmailOtp: 0 } },
        { new: true }
    );

    return successResponse({ res, message: 'Done', data: { userResult } });
});
