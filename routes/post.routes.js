const express=require("express")
const isAuth = require("../middleware/auth")
const checkrole = require("../middleware/checkrole")
const { createPost, deletePost, updatePost, GetPost } = require("../controllers/post.controller")
const upload = require("../utlis/multer")
const postRouter=express.Router()


postRouter.post("/create",isAuth,checkrole,createPost)
postRouter.delete("/delete/:postId/:userId",isAuth,checkrole,deletePost)
postRouter.patch("/update/:postId/:userId",isAuth,checkrole,upload.single("blogImage"),updatePost)
postRouter.get("/getpost",isAuth,GetPost)




module.exports=postRouter