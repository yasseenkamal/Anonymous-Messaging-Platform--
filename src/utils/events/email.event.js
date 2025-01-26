import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { customAlphabet } from "nanoid";
import { generateHash } from "../security/hash.js";
import userModel from "../../DB/model/User.model.js";
import { verifyEmailTemp } from "../template/varifyAccount.js";




export const emailEvent = new EventEmitter()
emailEvent.on('sendConfirmEmail', async (data) => {
    const { email } = data;
    const otp = customAlphabet("0123456789", 4)();
    const hashOTP = generateHash({ plaintext: otp });
    await userModel.updateOne({ email }, { confirmEmailOtp: hashOTP })
    const html = verifyEmailTemp({ code: otp })
    await sendEmail({ to: email, subject: 'confirmEmail OTP', html })

})
