const jwt = require("jsonwebtoken")
const isAuth = (req, res, next) => {
    const { Access_Token } = req.cookies
    jwt.verify(Access_Token, process.env.Private_key, function (err, decoded) {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" })
        }
        const user=decoded.userdata
        req.user=user
        next()
    });
}

module.exports = isAuth