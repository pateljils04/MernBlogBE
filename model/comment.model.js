const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    NumberofLikes:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const commentModel=mongoose.model("comments",commentSchema)

module.exports=commentModel