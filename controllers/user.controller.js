const { renderFile } = require("ejs")
const UserModel = require("../model/user.model")
const CreateOtp = require("../utlis/otpcreate")
const ejs = require("ejs")
const Sendmail = require("../utlis/email")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const Signup = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill this feilds" })
    }
    if (!(password.length >= 8 && password.length < 16)) {
        return res.status(400).json({ message: "Password must be between 8 and 16" })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User are already exist" })
        }
        const { token, otp } = CreateOtp({ name, email, password });

        const htmltemplate = await ejs.renderFile(__dirname + "/../views/email.ejs", { name, otp })

        // await Sendmail(email,htmltemplate)
        console.log(otp)
        res.cookie("verification_Token",token).status(200).json({message:"please verify your otp "})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

}

const Verification=(req,res)=>{

    const {otp}=req.body
    const {verification_Token}=req.cookies  
    if(!otp && otp.length != 4){
        return res.status(400).json({message:"Please enter otp"})
    }
    jwt.verify(verification_Token,process.env.Private_key, function(err,decoded){
        if(err){
            return res.status(400).json({message:"Invalid Token"})
        }
        const {user,otpGenerator}=decoded;
        if(otpGenerator!=otp){
            return res.status(400).json({message:"Invalid Otp"})
        }
        bcrypt.hash(user.password,5,async function(err,hash){
            if(err){
                return res.status(400).json({message:error.message})
            }
        await UserModel.create({...user,password:hash})
        res.status(200).json({message:"User created successfully"})
        })
        
    })
}

const Logout=(req,res)=>{
    const {Access_Token}=req.cookies
    if(!Access_Token){
       return res.status(400).json({message:"You not logout without login"})
    }
    res.clearCookie("Access_Token").status(200).json({message:"logout successfully"})
}

const Login=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"Please register"});
        }
       bcrypt.compare(password,user.password,function(err,result){
        if(err){
            return res.status(400).json({message:error.message});
        }
        if(!result){
            return res.status(400).json({message:"invalid password"})
        }
        const {password,...rest}=user._doc;
        const Access_token=jwt.sign({userdata:rest},process.env.Private_key,)
        if(!Access_token){
            return res.status(400).json({message:"error in generating token"})
        }
        res.cookie("Access_Token",Access_token).status(200).json({message:"You Login Successfully"})
       });
    } catch (error) {
        res.status(400).json({message:error.message});
    }

}

const GetUser=async(req,res)=>{
    const user=req.user
    // console.log(user)
    if(user._id!==req.params.userId){
        return res.status(400).json({error:"Invalid user"})
    }
    try {
        const userdata=await UserModel.findOne({_id:req.params.userId})
        const {password,...rest}=userdata._doc
        res.status(200).json({message:"Data get successfully",data:rest})
        
    } catch (error) {
        res.status(400).json({message:error.message}); 
    }
}

const UpdateUser=async(req,res)=>{
    const{filename}=req.file
    if(req.body.email || req.body.password || req.body.admin){
        return res.status(400).json({message:"Invalid Request"})
    }
    try {
        const updateuser=await UserModel.findByIdAndUpdate(req.params.userId,{$set:{...req.body,profileImage:filename}})
        const {password,...rest}=updateuser._doc
        res.status(200).json({message:"update successfully",data:rest})
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
};


// Admin Controller
const GetUsers=async(req,res)=>{
    const limit=req.query.limit || 11
    const skip=req.query.skip || 0

    try {
        const usersdata=await UserModel.find().limit(limit).skip(skip)
        if(!usersdata){
            return res.status(400).json({error:"No users found"})
        }
        res.status(200).json({message:"user get successfully",data:usersdata})
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}

const DeletebyAdmin= async(req,res)=>{
    try {
        const user=await UserModel.findOne({_id:req.params.userId})
        if(!user){
            return res.status(400).json({error:"user not found"})
        }
        const deleteuser=await UserModel.findByIdAndDelete(req.params.userId)
        const {password,...rest}=deleteuser._doc
        res.status(200).json({message:"User delete successfully",data:rest})
    } catch (error) {
        return res.status(400).json({error:error.message})
    }

}


module.exports = { Signup,Verification,Login,Logout,GetUser,UpdateUser,GetUsers,DeletebyAdmin};