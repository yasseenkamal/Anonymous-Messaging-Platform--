import messageModel from "../../../DB/model/message.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";



export const sendMessage = asyncHandler(
    async (req, res, next) => {

        const { message, recipientId } = req.body;
        if (!await userModel.findOne({ _id: recipientId, isDeleted: false })) {
            return next(new Error("In-valid account", { cause: 404 }))
        }
        const newMessage = await messageModel.create({ message, recipientId })

        return successResponse({ res, message: "Done", status: 201, data: { message: newMessage } })
    })     