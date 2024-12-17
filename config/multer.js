const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: 'dyv0lsr1o',
    api_key: '156871773169173',
    api_secret: 'vjZ2y18JFl-fazohE71oP6p777E',
  })
  
  // Multer setup to save files locally
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/assets/uploads'); // Local folder to save images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    },
  })
  const upload = multer({ storage: storage });

  module.exports = upload