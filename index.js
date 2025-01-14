const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const connection  = require("./db")
const UserRouter = require("./routes/user.routes")
const cookieParser = require("cookie-parser")
const postRouter = require("./routes/post.routes")
const commentRouter = require("./routes/comment.routes")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/user",UserRouter);
app.use("/post",postRouter)
app.use("/comment",commentRouter)

app.listen(process.env.PORT || 3000, async () => {
    try {
        await connection
        console.log("connected to DB")
        console.log(`server is running on port ${process.env.PORT || 3000}`)

    } catch (error) {
        console.log(error)
    }
})



