
// Validación de email
export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
  
  // Validación de contraseña (ejemplo: mínimo 6 caracteres)
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  // Validación de RUT (puedes ajustar la regex a las necesidades específicas de formato del RUT)
  export const validateRut = (rut) => {
    const re = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return re.test(rut);
  };
  
  // Validación de edad (ejemplo: debe ser un número y mayor o igual a 18)
  export const validateAge = (age) => {
    return !isNaN(age) && parseInt(age, 10) >= 18;
  };
  