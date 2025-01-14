const PostModel = require("../model/post.model");

const createPost = async (req, res) => {
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({ message: "Please fill this feilds" });
    }
    try {
        await PostModel.create({ ...req.body, userId: req.user._id })
        res.status(200).json({ message: "post create successfully" })
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const deletePost = async (req, res) => {
    if (req.user._id != req.params.userId) {
        return res.status(400).json({ message: "You are not authorised to delete this post" })
    }
    try {
        const singlepost = await PostModel.findOne({ _id: req.params.postId })
        if (!singlepost) {
            return res.status(400).json({ message: "Post not found" })
        }
        await PostModel.findByIdAndDelete(req.params.postId)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    const { filename } = req.file
    if (req.user._id != req.params.userId) {
        return res.status(400).json({ message: "you not authorised to update this post" });
    }

    if (req.body.userId) {
        return res.status(400).json({ message: "You cannot change user Id " });
    }

    try {
        const updatedata = await PostModel.findByIdAndUpdate(req.params.postId, { $set: { ...req.body, blogImage: filename } })
        if (!updatedata) {
            return res.status(400).json({ message: "post not found" })
        }
        res.status(200).json({ message: "Post updated successfully", data: updatedata })
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const GetPost = async (req, res) => {
    const limit=req.query.limit || 10
    const skip=req.query.skip || 0
    const sort=req.query.sort=="asc"? 1:-1

    const search = req.query.q || ""
    try {
        const post = await PostModel.find({
            $or: [{
                title: { $regex: search, $options: "i" }
            }, {
                content: { $regex: search, $options: "i" }
            },],
        }).skip(skip).limit(limit).sort({createdAt:sort})
        const totalpost=await PostModel.countDocuments()
        res.status(200).json({message:"data get successfully",totalpost,post})

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

}
module.exports = { createPost, deletePost, updatePost, GetPost }