
import mongoose, { Schema, Types, model } from "mongoose";


const messageSchema = new Schema({

    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50000,
        trim: true
    },
    recipientId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }


}, {
    timestamps: true
})

const messageModel = mongoose.models.Message || model('Message',messageSchema)
export default messageModel  