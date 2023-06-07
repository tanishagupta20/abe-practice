const { Router } = require("express")
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const User = require('../models/User.js')

const router = Router();

router.post("/upload/image", upload.single("file"), async (req, res) => {
    const update = await User.findOneAndUpdate({ username: req.session.usn }, { userImage: req.file.filename })
    res.status(200).json({ error: false, message: "Image upload success" })
})

module.exports = router