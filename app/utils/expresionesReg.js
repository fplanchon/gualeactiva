const expRegulares = {
  dni: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/,                             // Coincide con un DNI con y sin puntos.
  cuil: /^([0-9]{11}|[0-9]{2}-[0-9]{8}-[0-9]{1})$/,
  cel: /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/ // Telefonos de argentina
}

export default expRegulares