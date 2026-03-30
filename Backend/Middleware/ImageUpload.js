const cloudinary = require("../Config/CloudinaryConfig.js");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'speakBuddy',
    allowed_formats:["jpg", "png" , "jpeg","webp"],
    transformation: [
      { width: 225, height: 225, crop: "fill", gravity: "auto" } // gravity: "face" it autometically choose the best part
    ],                 // auto if face available detect o/w normal crop
    public_id: (req, file) => `users_${req.params.id}`,
  },
});

const upload = multer({ storage: storage });

module.exports = upload;