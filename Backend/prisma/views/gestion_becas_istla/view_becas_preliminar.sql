SELECT
  `isb`.`CEDULA_ESTUDIANTE` AS `CEDULA_ESTUDIANTE`,
  `isb`.`NOMBRE_ESTUDIANTE` AS `NOMBRE_ESTUDIANTE`,
  `ivb`.`ID_PERIODO` AS `ID_PERIODO`,
  `isb`.`FECHA` AS `FECHA_SOLICITUD`,
  `itp`.`TIPO_BECA` AS `TIPO_BECA`,
  `ido`.`PROMEDIO_1` AS `PROMEDIO`,
  `ibo`.`PORCENTAJE` AS `PORCENTAJE_PROPUESTO`
FROM
  (
    (
      (
        (
          `gestion_becas_istla`.`istla_solicitudes_beca` `isb`
          JOIN `gestion_becas_istla`.`istla_vigencia_beca` `ivb` ON((`isb`.`ID_VIGENCIA` = `ivb`.`ID_VIGENCIA`))
        )
        JOIN `gestion_becas_istla`.`istla_documentos_obligatorios` `ido` ON((`isb`.`ID_SOLICITUD` = `ido`.`ID_SOLICITUD`))
      )
      JOIN `gestion_becas_istla`.`istla_tipo_beca` `itp` ON((`isb`.`ID_TIPO_BECA` = `itp`.`ID_TIPO_BECA`))
    )
    JOIN `gestion_becas_istla`.`istla_becas_otorgadas` `ibo` ON((`isb`.`ID_SOLICITUD` = `ibo`.`ID_SOLICITUD`))
  )
WHERE
  (`ibo`.`PORCENTAJE_VERIFICADO` = 0)