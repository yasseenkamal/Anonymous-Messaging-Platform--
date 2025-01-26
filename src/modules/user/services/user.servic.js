import messageModel from '../../../DB/model/message.model.js'
import userModel from '../../../DB/model/User.model.js'
import { asyncHandler } from '../../../utils/error/error.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { generateDecryption } from '../../../utils/security/encryption.js'
import { comparHash, generateHash } from '../../../utils/security/hash.js'



export const profile = asyncHandler(
    async (req, res, next) => {
        req.user.phone = generateDecryption({ cipherText: req.user.phone })
        const message = await messageModel.find({ recipientId: req.user._id }).populate([
            {
                path: "recipientId",
                select: "-password"
            }
        ])
        return successResponse({ res, data: { user: req.user, message } })

    }
)

export const shareProfile = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findOne({ _id: req.params.userId, isDeleted: false }).select("userName email image")
        return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account id", { cause: 404 }))

    }
)


export const updateProfile = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidator: true })
        return successResponse({ res, data: { user } })

    }
)



export const updatePassword = asyncHandler(
    async (req, res, next) => {
        const { password, oldPassword } = req.body;
        if (!comparHash({ plaintext: oldPassword, hashValue: req.user.password })) {
            return next(new Error("in-valid old password", { cause: 409 }))
        }
        const hashPassword = generateHash({ plaintext: password })
        const user = await userModel.findByIdAndUpdate(req.user._id, { password: hashPassword, changePasswordTime: Date.now() }, { new: true, runValidator: true })
        return successResponse({ res, data: { user } })

    }
)

export const freezeProfile = asyncHandler(
    async (req, res, next) => {

        const user = await userModel.findByIdAndUpdate(req.user._id, { isDeleted: true, changePasswordTime: Date.now() }, { new: true, runValidator: true })
        return successResponse({ res, data: { user } })

    }
)