const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getEstadoDocumentos,
  postDocumentos,
} = require("../services/documentacionBeca");
const { upload } = require("../config/multerConfig");

router.use(verifyToken);

router.get("/obtenerEstadoDocumentos", getEstadoDocumentos);

router.post('/guardarDocumentos',
  upload.fields([ 
    { name: "CERTIFICADO_MATRICULA" },
    { name: "COPIA_CEDULA" },
    { name: "CERTIFICADO_ASISTENCIA" },
    { name: "CERTIFICADO_PAGOS" },
    { name: "CERTIFICADO_DISCIPLINA" },
    { name: "FICHA_SOCIOECONOMICA" },
    { name: "MECANIZADO_IESS" },
    { name: "CERTIFICADO_IESS" },
    { name: "DECLARACION_IMPUESTOS" },
    { name: "DECLARATORIA_ZONA_EMERGENCIA" },
    { name: "PARTIDA_DEFUNCION" },
    { name: "CERTIFICADO_MEDICO_DEPENDENCIA" },
    { name: "INFORME_POLICIAL" },
    { name: "CERTIFICADO_MEDICO_PERSONAL" },
    { name: "OTRO_DOCUMENTO" },
    { name: "CERTIFICADO_APROBACION_SEMESTRE" },
    { name: "CERTIFICADO_NOTA" },
    { name: "TRAYECTORIA_DEPORTIVA" },
    { name: "INFORME_FEDERACIONDEPORTIVA" },
    { name: "RECONOCIMIENTO_HEROE" },
    { name: "INFORME_ACTIVIDADES_CLUB" },
    { name: "INFORME_BIENESTAR_CLUB" },
    { name: "CARNE_MSP" },
  ]),
  postDocumentos
);

module.exports = router;
