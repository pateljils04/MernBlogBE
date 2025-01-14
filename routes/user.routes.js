const express=require("express")
const UserRouter=express.Router()
const { Signup, Verification, Login, Logout, GetUser, UpdateUser, GetUsers, DeletebyAdmin } = require("../controllers/user.controller")
const isAuth = require("../middleware/auth")
const upload = require("../utlis/multer")
const checkrole = require("../middleware/checkrole")

UserRouter.post("/signup",Signup)
UserRouter.post("/verification",Verification)
UserRouter.post("/signin",Login)
UserRouter.get("/logout",Logout)    

UserRouter.get("/getuser/:userId",isAuth,GetUser)
UserRouter.patch("/update/:userId",isAuth,upload.single("profileImage"),UpdateUser)

// Admin Routes
UserRouter.get("/getusers",isAuth,checkrole,GetUsers)
UserRouter.delete("/delete/:userId",isAuth,checkrole,DeletebyAdmin)


module.exports=UserRouter