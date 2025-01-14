const express=require("express")
const isAuth = require("../middleware/auth")
const { createComment, GetPostComment, editPostComment, deleteComment, likes, CommentsTotal } = require("../controllers/comment.controller")
const checkrole = require("../middleware/checkrole")

const commentRouter=express.Router()

commentRouter.post("/create",isAuth,createComment)
commentRouter.get("/getpostcomment/:postId",isAuth,GetPostComment)
commentRouter.patch("/editcomment/:commentId",isAuth,editPostComment)
commentRouter.delete("/deletecomment/:commentId/:userId",isAuth,deleteComment)
commentRouter.patch("/like/:commentId/:userId",isAuth,likes)
commentRouter.get("/getcomment",isAuth,checkrole,CommentsTotal)
module.exports=commentRouter