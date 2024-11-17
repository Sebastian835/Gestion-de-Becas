SELECT
  `gestion_becas_itsla`.`istla_estado_solicitud`.`ESTADO` AS `ESTADO`,
  `gestion_becas_itsla`.`istla_tipo_beca`.`TIPO_BECA` AS `TIPO_BECA`,
  `gestion_becas_itsla`.`istla_solicitudes_beca`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `gestion_becas_itsla`.`istla_solicitudes_beca`.`FECHA` AS `FECHA`,
  `gestion_becas_itsla`.`istla_solicitudes_beca`.`DOCUMENTO_SOLICITUD` AS `DOCUMENTO_SOLICITUD`
FROM
  (
    (
      `gestion_becas_itsla`.`istla_estado_solicitud`
      JOIN `gestion_becas_itsla`.`istla_solicitudes_beca` ON(
        (
          `gestion_becas_itsla`.`istla_estado_solicitud`.`ID_ESTADO` = `gestion_becas_itsla`.`istla_solicitudes_beca`.`ESTADO`
        )
      )
    )
    JOIN `gestion_becas_itsla`.`istla_tipo_beca` ON(
      (
        `gestion_becas_itsla`.`istla_solicitudes_beca`.`ID_TIPO_BECA` = `gestion_becas_itsla`.`istla_tipo_beca`.`ID_TIPO_BECA`
      )
    )
  )