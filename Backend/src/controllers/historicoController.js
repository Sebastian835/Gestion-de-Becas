const { historicoService } = require("../services/historico");
const fs = require("fs/promises");

const historicoController = {
  async getHistorico(req, res) {
    try {
      const { cedula } = req.params;

      const historico = await historicoService.getHistorico(cedula);

      if (!historico) {
        return res.status(200).json(false);
      }

      res.json(historico);
    } catch (error) {
      console.error("Error en getHistorico:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async getSolicitudPDF(req, res) {
    try {
      const { cedula, periodo } = req.params;

      if (!cedula || !periodo) {
        return res.status(400).json({
          message: "Faltan parámetros requeridos",
        });
      }

      const pdfBuffer = await historicoService.getSolicitudPDF(cedula, periodo);

      if (!pdfBuffer) {
        return res.status(404).json({
          message: "No se encontró el documento solicitado",
        });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=solicitud_${cedula}_${periodo}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async getDocumentoArchivo(req, res) {
    try {
      const { ruta } = req.params;
      const rutaDecodificada = decodeURIComponent(ruta);

      if (
        !rutaDecodificada.startsWith("Documentos_Becas") ||
        rutaDecodificada.includes("..") ||
        /[<>:"|?*]/.test(rutaDecodificada)
      ) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      try {
        await fs.access(rutaDecodificada);

        const archivo = await fs.readFile(rutaDecodificada);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        // Enviar el archivo
        res.send(archivo);
      } catch (error) {
        return res.status(404).json({ message: "Archivo no encontrado" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error al obtener el archivo" });
    }
  },
};
module.exports = { historicoController };
