const multer = require("multer");

const storage = multer.memoryStorage();//this tell multer keep uploaded files in ram

const fileFilter = (req, file, cb) => {//req- the express req file-info abt uploaded file cb-callback to tell multer accept or reject
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);//replying to multer no error null accept the file true
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};
const upload = multer({
    storage,
    fileFilter,
});
module.exports = upload;