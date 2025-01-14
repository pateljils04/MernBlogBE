const multer = require("multer")
const fs = require("fs")

const foldercreater = (path, foldername, cb) => {
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            console.log(err)
        } else {
            cb(null, foldername)
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let foldername = "uploads/"

        if (file.fieldname == "profileImage") {
            foldername += "user"
            foldercreater("./uploads/user", foldername, cb);
        }
        else {
            foldername += "blog"
            foldercreater("./uploads/blog", foldername, cb);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload