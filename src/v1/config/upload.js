require('dotenv').config();
const multer = require('multer');
const path = require('path');

const uploadConfig = {
  dest: path.resolve(__dirname, '..', '..', 'uploads'),
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};

const upload = multer(uploadConfig);

module.exports = upload;
