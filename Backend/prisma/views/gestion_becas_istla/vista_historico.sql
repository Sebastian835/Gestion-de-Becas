SELECT
  `sb`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `tp`.`TIPO_BECA` AS `TIPO_BECA`,
  `vb`.`ID_PERIODO` AS `PERIODO_SOLICITUD`,
  `bo`.`PERIODO_CADUCIDAD` AS `PERIODO_CADUCIDAD`,
  `bo`.`PORCENTAJE` AS `PORCENTAJE`,
  `gestion_becas_istla`.`istla_estado_solicitud`.`ESTADO` AS `ESTADO`,
  `sb`.`DOCUMENTO_SOLICITUD` AS `SOLICITUD`,
  `bo`.`RENOVACION` AS `RENOVACION`,
  `ido`.`CERTIFICADO_MATRICULA` AS `CERTIFICADO_MATRICULA`,
  `ido`.`COPIA_CEDULA` AS `COPIA_CEDULA`,
  `ido`.`CERTIFICADO_PAGOS` AS `CERTIFICADO_PAGOS`,
  `ido`.`CERTIFICADO_ASISTENCIA` AS `CERTIFICADO_ASISTENCIA`,
  `ido`.`CERTIFICADO_DISCIPLINA` AS `CERTIFICADO_DISCIPLINA`,
  `ido`.`MOTIVO_RECHAZO` AS `MOTIVO_RECHAZO`,
  `dt`.`CERTIFICADO_APROBACION_SEMESTRE` AS `CERTIFICADO_APROBACION_SEMESTRE`,
  `dt`.`CERTIFICADO_NOTA` AS `CERTIFICADO_NOTA`,
  `dt`.`TRAYECTORIA_DEPORTIVA` AS `TRAYECTORIA_DEPORTIVA`,
  `dt`.`INFORME_FEDERACIONDEPORTIVA` AS `INFORME_FEDERACIONDEPORTIVA`,
  `dt`.`RECONOCIMIENTO_HEROE` AS `RECONOCIMIENTO_HEROE`,
  `dt`.`INFORME_ACTIVIDADES_CLUB` AS `INFORME_ACTIVIDADES_CLUB`,
  `dt`.`INFORME_BIENESTAR_CLUB` AS `INFORME_BIENESTAR_CLUB`,
  `dt`.`CARNE_MSP` AS `CARNE_MSP`,
  `dt`.`FICHA_SOCIOECONOMICA` AS `FICHA_SOCIOECONOMICA`,
  `dt`.`MECANIZADO_IESS` AS `MECANIZADO_IESS`,
  `dt`.`CERTIFICADO_IESS` AS `CERTIFICADO_IESS`,
  `dt`.`DECLARACION_IMPUESTOS` AS `DECLARACION_IMPUESTOS`,
  `dt`.`PARTIDA_DEFUNCION` AS `PARTIDA_DEFUNCION`,
  `dt`.`DECLARATORIA_ZONA_EMERGENCIA` AS `DECLARATORIA_ZONA_EMERGENCIA`,
  `dt`.`CERTIFICADO_MEDICO_DEPENDENCIA` AS `CERTIFICADO_MEDICO_DEPENDENCIA`,
  `dt`.`INFORME_POLICIAL` AS `INFORME_POLICIAL`,
  `dt`.`CERTIFICADO_MEDICO_PERSONAL` AS `CERTIFICADO_MEDICO_PERSONAL`,
  `dt`.`OTRO_DOCUMENTO` AS `OTRO_DOCUMENTO`
FROM
  (
    (
      (
        (
          (
            (
              `gestion_becas_istla`.`istla_vigencia_beca` `vb`
              JOIN `gestion_becas_istla`.`istla_solicitudes_beca` `sb` ON((`vb`.`ID_VIGENCIA` = `sb`.`ID_VIGENCIA`))
            )
            JOIN `gestion_becas_istla`.`istla_tipo_beca` `tp` ON((`sb`.`ID_TIPO_BECA` = `tp`.`ID_TIPO_BECA`))
          )
          JOIN `gestion_becas_istla`.`istla_becas_otorgadas` `bo` ON((`bo`.`ID_SOLICITUD` = `sb`.`ID_SOLICITUD`))
        )
        JOIN `gestion_becas_istla`.`istla_documentos_obligatorios` `ido` ON((`sb`.`ID_SOLICITUD` = `ido`.`ID_SOLICITUD`))
      )
      JOIN `gestion_becas_istla`.`istla_documentos_detalle` `dt` ON(
        (
          `ido`.`ID_DOCUMENTOS` = `dt`.`ID_DOCUMENTOS_OBLIGATORIOS`
        )
      )
    )
    JOIN `gestion_becas_istla`.`istla_estado_solicitud` ON(
      (
        `bo`.`ID_ESTADO` = `gestion_becas_istla`.`istla_estado_solicitud`.`ID_ESTADO`
      )
    )
  )