SELECT
  `u`.`ID_USUARIO` AS `ID_USUARIO`,
  `ru`.`NOMBRE` AS `ROL`,
  `u`.`USUARIO` AS `USUARIO`,
  `u`.`PASSWORD` AS `PASSWORD`,
  `u`.`NOMBRES` AS `NOMBRES`,
  `u`.`APELLIDOS` AS `APELLIDOS`,
  `u`.`CORREO` AS `CORREO`,
  `u`.`DESCRIPCION` AS `DESCRIPCION`,
  `u`.`CEDULA` AS `CEDULA`
FROM
  (
    `gestion_becas_istla`.`istla_usuarios` `u`
    JOIN `gestion_becas_istla`.`istla_rol_usuario` `ru` ON((`u`.`ID_ROL` = `ru`.`ID_ROL`))
  )