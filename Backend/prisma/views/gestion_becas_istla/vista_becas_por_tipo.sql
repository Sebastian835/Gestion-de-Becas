SELECT
  `tp`.`TIPO_BECA` AS `TIPO_BECA`,
  count(`bo`.`ID_BECA`) AS `Becas`
FROM
  (
    (
      `gestion_becas_istla`.`istla_becas_otorgadas` `bo`
      JOIN `gestion_becas_istla`.`istla_solicitudes_beca` `sb` ON((`bo`.`ID_SOLICITUD` = `sb`.`ID_SOLICITUD`))
    )
    JOIN `gestion_becas_istla`.`istla_tipo_beca` `tp` ON((`tp`.`ID_TIPO_BECA` = `sb`.`ID_TIPO_BECA`))
  )
GROUP BY
  `tp`.`TIPO_BECA`