import userModel from "../../../DB/model/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { comparHash } from "../../../utils/security/hash.js";
import { generateToken } from "../../../utils/security/token.js";




export const login = asyncHandler(
    async (req, res, next) => {


        const { email, password } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new Error('In-valid login data', { cause: 404 }))
        }
        if (!user.confirmEmail) {
            return next(new Error('please confirm your email first', { cause: 400 }))

        }

        if (!comparHash({ plaintext: password, hashValue: user.password })) {
            return next(new Error('In-valid login data', { cause: 400 }))

        }
        const token =
            generateToken({
                payload: { id: user._id, isLoggenIn: true },
                signature: user.role == userRoles.admin ? process.env.TOKEN_SIGNATURE_ADMIN : process.env.TOKEN_SIGNATURE,
                options: { expiresIn: 3600 }
            })
        if (user.isDeleted) {
            user.isDeleted = false;
            await user.save()
        } 

        return successResponse({ res, message: 'Done', data: { token } })
    }

)