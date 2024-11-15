SELECT
  `sb`.`cedula_estudiante` AS `cedula_estudiante`,
  `tp`.`tipo_beca` AS `tipo_beca`,
  `sb`.`fecha` AS `fecha`,
  `es`.`estado` AS `estado`,
  `sb`.`documento_solicitud` AS `documento_solicitud`
FROM
  (
    (
      `gestion_becas_itsla`.`istla_solicitudes_beca` `sb`
      JOIN `gestion_becas_itsla`.`istla_tipo_beca` `tp` ON((`sb`.`tipo_beca` = `tp`.`id`))
    )
    JOIN `gestion_becas_itsla`.`istla_estado_solicitud` `es` ON((`sb`.`estado` = `es`.`id`))
  )