const mongoose=require("mongoose")


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    profileImage:{
        type:String,
        default:"https://images.unsplash.com/photo-1729433321272-9243b22c5f6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
    },
    role:{
        type:String,
        default:"user"
    }

})

const UserModel=mongoose.model("user",UserSchema)


module.exports=UserModel