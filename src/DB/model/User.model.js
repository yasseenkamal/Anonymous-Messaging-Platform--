import { model, Mongoose, Schema } from "mongoose";
import { userRoles } from "../../middleware/auth.middleware.js";


const roletypes = {
    User: 'User',
    Admin: 'Admin'
}



const userSchema = Schema({

    userName: {
        type: String,
        required: [true, 'please enter your username'],
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    confirmEmailOtp: String,
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    image: String,
    DOB: Date,
    phone: String,
    confirmEmail: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(userRoles),
        default: userRoles.user
    },
    changePasswordTime: Date,
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

const userModel = model("User", userSchema)
export default userModel





