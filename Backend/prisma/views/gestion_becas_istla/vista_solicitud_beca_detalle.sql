SELECT
  `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_SOLICITUD` AS `ID_SOLICITUD`,
  `gestion_becas_istla`.`istla_solicitudes_beca`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `gestion_becas_istla`.`istla_solicitudes_beca`.`FECHA` AS `FECHA`,
  `gestion_becas_istla`.`istla_tipo_beca`.`TIPO_BECA` AS `TIPO_BECA`,
  `gestion_becas_istla`.`istla_solicitudes_beca`.`DOCUMENTO_SOLICITUD` AS `DOCUMENTO_SOLICITUD`,
  `gestion_becas_istla`.`istla_estado_solicitud`.`ESTADO` AS `ESTADO`,
  `gestion_becas_istla`.`istla_vigencia_beca`.`ID_PERIODO` AS `ID_PERIODO`,
  `gestion_becas_istla`.`istla_solicitudes_beca`.`NOMBRE_ESTUDIANTE` AS `NOMBRE_ESTUDIANTE`
FROM
  (
    (
      (
        `gestion_becas_istla`.`istla_solicitudes_beca`
        JOIN `gestion_becas_istla`.`istla_estado_solicitud` ON(
          (
            `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_ESTADO` = `gestion_becas_istla`.`istla_estado_solicitud`.`ID_ESTADO`
          )
        )
      )
      JOIN `gestion_becas_istla`.`istla_vigencia_beca` ON(
        (
          `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_VIGENCIA` = `gestion_becas_istla`.`istla_vigencia_beca`.`ID_VIGENCIA`
        )
      )
    )
    JOIN `gestion_becas_istla`.`istla_tipo_beca` ON(
      (
        `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_TIPO_BECA` = `gestion_becas_istla`.`istla_tipo_beca`.`ID_TIPO_BECA`
      )
    )
  )