export const expRegulares = {
  dni: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/, // Coincide con un DNI con y sin puntos.
  cel: /^(?!0)(?!15)(?:11|[2368]\d)??\d{8}$/,  // No acepta +54, ni 0+codigo de area; es obligatorio el codigo de area y no acepta el uso del 15.
  cel2: /^(?!15)(?:11|[2368]\d)??\d{8}$/
};

export const cuilValidator = (cuil) => {
  if (cuil.length !== 11) {
    return false;
  }

  const [checkDigit, ...rest] = cuil.split("").map(Number).reverse();

  const total = rest.reduce(
    (acc, cur, index) => acc + cur * (2 + (index % 6)),
    0
  );

  const mod11 = 11 - (total % 11);

  if (mod11 === 11) {
    return checkDigit === 0;
  }

  if (mod11 === 10) {
    return false;
  }

  return checkDigit === mod11;
};
