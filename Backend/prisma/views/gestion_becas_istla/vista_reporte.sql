SELECT
  `gestion_becas_istla`.`istla_solicitudes_beca`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `gestion_becas_istla`.`istla_vigencia_beca`.`ID_PERIODO` AS `ID_PERIODO`,
  `gestion_becas_istla`.`istla_becas_otorgadas`.`PORCENTAJE` AS `PORCENTAJE`,
  `gestion_becas_istla`.`istla_tipo_beca`.`TIPO_BECA` AS `TIPO_BECA`,
  coalesce(
    `istla_estado_solicitud_bo`.`ESTADO`,
    `istla_estado_solicitud_sb`.`ESTADO`
  ) AS `ESTADO`
FROM
  (
    (
      (
        (
          (
            `gestion_becas_istla`.`istla_solicitudes_beca`
            JOIN `gestion_becas_istla`.`istla_vigencia_beca` ON(
              (
                `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_VIGENCIA` = `gestion_becas_istla`.`istla_vigencia_beca`.`ID_VIGENCIA`
              )
            )
          )
          LEFT JOIN `gestion_becas_istla`.`istla_becas_otorgadas` ON(
            (
              `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_SOLICITUD` = `gestion_becas_istla`.`istla_becas_otorgadas`.`ID_SOLICITUD`
            )
          )
        )
        JOIN `gestion_becas_istla`.`istla_tipo_beca` ON(
          (
            `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_TIPO_BECA` = `gestion_becas_istla`.`istla_tipo_beca`.`ID_TIPO_BECA`
          )
        )
      )
      LEFT JOIN `gestion_becas_istla`.`istla_estado_solicitud` `istla_estado_solicitud_bo` ON(
        (
          `gestion_becas_istla`.`istla_becas_otorgadas`.`ID_ESTADO` = `istla_estado_solicitud_bo`.`ID_ESTADO`
        )
      )
    )
    JOIN `gestion_becas_istla`.`istla_estado_solicitud` `istla_estado_solicitud_sb` ON(
      (
        `gestion_becas_istla`.`istla_solicitudes_beca`.`ID_ESTADO` = `istla_estado_solicitud_sb`.`ID_ESTADO`
      )
    )
  )