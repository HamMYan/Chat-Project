const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        file.originalname.slice(0, 3) +
        path.extname(file.originalname)
    );
  },
});
module.exports.upload = multer({ storage: storage });