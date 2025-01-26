import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import messageController from './modules/message/message.controller.js'
import { globalErrorHaneling } from './utils/error/error.js'
import cors from 'cors'

const bootstrap = (app, express) => {
   
   app.use(cors())
    //Convert buffer json data
    app.use(express.json())

    //Application Routing
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/message", messageController)


    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })

    //Error handling
    app.use(globalErrorHaneling)

    //DB
    connectDB()

}

export default bootstrap