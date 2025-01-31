SELECT
  `bo`.`ID_BECA` AS `ID_BECA`,
  `sb`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `tp`.`TIPO_BECA` AS `TIPO_BECA`,
  `bo`.`PORCENTAJE` AS `PORCENTAJE`,
  `vb`.`ID_PERIODO` AS `ID_PERIODO`,
  `bo`.`PERIODO_CADUCIDAD` AS `PERIODO_CADUCIDAD`,
  `bo`.`ID_ESTADO` AS `ID_ESTADO`,
  `es`.`ESTADO` AS `ESTADO_BECA`,
  `bo`.`RENOVACION` AS `RENOVACION`,
  `bo`.`PROMEDIO_2` AS `PROMEDIO_2`
FROM
  (
    (
      (
        (
          `gestion_becas_istla`.`istla_becas_otorgadas` `bo`
          JOIN `gestion_becas_istla`.`istla_solicitudes_beca` `sb` ON((`bo`.`ID_SOLICITUD` = `sb`.`ID_SOLICITUD`))
        )
        JOIN `gestion_becas_istla`.`istla_tipo_beca` `tp` ON((`sb`.`ID_TIPO_BECA` = `tp`.`ID_TIPO_BECA`))
      )
      JOIN `gestion_becas_istla`.`istla_vigencia_beca` `vb` ON((`sb`.`ID_VIGENCIA` = `vb`.`ID_VIGENCIA`))
    )
    JOIN `gestion_becas_istla`.`istla_estado_solicitud` `es` ON((`bo`.`ID_ESTADO` = `es`.`ID_ESTADO`))
  )