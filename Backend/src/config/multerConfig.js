const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './Documentos_Becas';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const filename = `${baseName}-${randomSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = { upload };
