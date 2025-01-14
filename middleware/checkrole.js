const checkrole=(req,res,next)=>{
    const {role}=req.user
    if(role!="admin"){
        return res.status(400).json({message:"Access Denied"})
    }else{
    next();
    }
};
module.exports=checkrole