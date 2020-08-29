const { resolve, extname } = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resolve(__dirname, '..', '..', 'public', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
        const suffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '_' + suffix + extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;
