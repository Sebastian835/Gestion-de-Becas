const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { periodo, usuario } = req.body;
    if (!periodo || !usuario) {
      return cb(new Error("Periodo y usuario son requeridos"));
    }
    const usuarioFormat = usuario.replace(/\s+/g, "");
    const periodoFormat = periodo.replace(/\s+/g, "");
    const uploadDir = path.join(
      "./Documentos_Becas",
      periodoFormat,
      usuarioFormat
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}.pdf`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
