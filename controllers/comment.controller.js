const commentModel = require("../model/comment.model")
const PostModel = require("../model/post.model")

const createComment = async (req, res) => {
    const { userId, postId, content } = req.body
    try {
        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "Post not found" })
        }
        const comment = await commentModel.create({ userId, postId, content })
        res.status(200).json({ message: "Comment successfully", comment })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const GetPostComment = async (req, res) => {
    try {
        const comment = await commentModel.find({ postId: req.params.postId })
        if (!comment) {
            return res.status(400).json({ message: "post not found" })
        }
        const numberofcomment = await commentModel.countDocuments({ postId: req.params.postId })
        res.status(200).json({ message: "ok", comment, numberofcomment })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const editPostComment = async (req, res) => {
    if (!req.body.content) {
        return res.status(400).json({ message: "content is required" })
    }
    try {
        const comment = await commentModel.findById(req.params.commentId)
        if (!comment) {
            return res.status(400).json({ message: "Comment not found" })
        }
        await commentModel.findByIdAndUpdate(req.params.commentId, { $set: { content: req.body.content } })
        res.status(200).json({ message: "Comment edit successfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

}
const deleteComment = async (req, res) => {

    if (req.params.userId !== req.user._id || !req.user.role) {
        return res.status(403).json({ message: "You are not authorised to delete this comment" });
    }
    try {
        const comment = await commentModel.findById(req.params.commentId);
        if (!comment) {
            return res.status(400).json({ message: "Comment not found" });
        }
        await commentModel.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment Delete Successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const likes = async (req, res) => {
    try {
        const Comment = await commentModel.findById( req.params.commentId )
        if (!Comment) {
            return res.status(400).json({ message: "comment not found" });
        }
        const index = Comment.likes.indexOf(req.params.userId);

        if (index == -1) {
            Comment.likes.push(req.params.userId);
            Comment.NumberofLikes += 1
        }
        else {
            Comment.likes.splice(index, 1);
            Comment.NumberofLikes -= 1;
        }
        await Comment.save();
        res.send("ok")
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const CommentsTotal=async(req,res)=>{
    try {
        const comment=await commentModel.find().limit(req.query.limit||5).skip(req.query.skip||0).sort({createdAt:-1})
        res.json(comment)
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = { createComment, GetPostComment, editPostComment, deleteComment, likes,CommentsTotal }