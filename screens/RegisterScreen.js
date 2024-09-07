import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail, validatePassword, validateAge } from '../validation/validationRegister';
import styles from '../Stylesheet/registerStyle'; // Importar estilos desde el nuevo archivo
// import HeaderBar from '../Bar/HeaderBar'; 

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rut, setRut] = useState('');
  const [rutError, setRutError] = useState('');
  const [edad, setEdad] = useState('');
  const [edadError, setEdadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [backendError, setBackendError] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    specialChar: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const clearError = (setError) => {
    setTimeout(() => {
      setError('');
    }, 1500);
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setBackendError('');
    }, 1500);
  };

  const formatRut = (rut) => {
    let formattedRut = rut.replace(/[^\dkK]+/g, '');
    if (formattedRut.length <= 1) return formattedRut;

    formattedRut = formattedRut.slice(0, -1) + '-' + formattedRut.slice(-1);
    return formattedRut.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const validateRut = (rut) => {
    const re = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return re.test(rut);
  };

  const handlePasswordChange = (password) => {
    setContraseña(password);
    setPasswordValid({
      length: password.length > 7,
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleRegister = async () => {
    let error = false;

    if (!nombre.trim()) {
      setNombreError('El campo nombre es obligatorio.');
      clearError(setNombreError);
      error = true;
    }

    if (email.trim() === '') {
      setEmailError('El campo de correo es obligatorio.');
      clearError(setEmailError);
      error = true;
    } else if (!validateEmail(email)) {
      setEmailError('El correo no es válido.');
      clearError(setEmailError);
      error = true;
    }

    if (rut.trim() === '') {
      setRutError('El campo de RUT es obligatorio.');
      clearError(setRutError);
      error = true;
    } else if (!validateRut(rut)) {
      setRutError('El RUT no es válido.');
      clearError(setRutError);
      error = true;
    }

    if (contraseña.trim() === '') {
      setPasswordError('El campo de contraseña es obligatorio.');
      clearError(setPasswordError);
      error = true;
    } else if (!passwordValid.length || !passwordValid.specialChar) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres y un carácter especial.');
      clearError(setPasswordError);
      error = true;
    }

    if (edad.trim() === '') {
      setEdadError('El campo de edad es obligatorio.');
      clearError(setEdadError);
      error = true;
    } else if (!validateAge(edad)) {
      setEdadError('La edad no es válida.');
      clearError(setEdadError);
      error = true;
    }

    if (error) return;

    const newFormData = { nombre, email, contraseña, rut, edad };

    try {
      const response = await fetch('http://192.168.1.86:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFormData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Registro exitoso. Tu cuenta ha sido creada.");
        clearMessages();
        setNombre('');
        setEmail('');
        setContraseña('');
        setRut('');
        setEdad('');
        setNombreError('');
        setEmailError('');
        setPasswordError('');
        setRutError('');
        setEdadError('');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setBackendError(result.message || 'Error desconocido al tratar de registrar.');
        clearMessages();
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setBackendError('Error de Conexión: No se pudo conectar al servidor.');
      clearMessages();
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <HeaderBar /> */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        {backendError ? <Text style={styles.errorText}>{backendError}</Text> : null}
        <TextInput
          style={[styles.input, nombreError ? styles.invalidInput : null]}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          onBlur={() => {
            if (!nombre.trim()) {
              setNombreError('El campo nombre es obligatorio.');
              clearError(setNombreError);
            }
          }}
        />
        {nombreError ? <Text style={styles.errorText}>{nombreError}</Text> : null}
        <TextInput
          style={[styles.input, emailError ? styles.invalidInput : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => {
            if (email.trim() === '') {
              setEmailError('El campo de correo es obligatorio.');
              clearError(setEmailError);
            } else if (!validateEmail(email)) {
              setEmailError('El correo no es válido.');
              clearError(setEmailError);
            }
          }}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={[styles.input, passwordError ? styles.invalidInput : null]}
          placeholder="Contraseña"
          value={contraseña}
          onChangeText={handlePasswordChange}
          onFocus={() => setShowPasswordRequirements(true)}
          onBlur={() => {
            setShowPasswordRequirements(false);
            if (contraseña.trim() === '') {
              setPasswordError('El campo de contraseña es obligatorio.');
              clearError(setPasswordError);
            } else if (!passwordValid.length || !passwordValid.specialChar) {
              setPasswordError('La contraseña debe tener al menos 8 caracteres y un carácter especial.');
              clearError(setPasswordError);
            }
          }}
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {showPasswordRequirements && (
          <View style={styles.passwordRequirements}>
            <Text style={passwordValid.length ? styles.validRequirement : styles.invalidRequirement}>
              La contraseña debe tener más de 7 caracteres.
            </Text>
            <Text style={passwordValid.specialChar ? styles.validRequirement : styles.invalidRequirement}>
              La contraseña debe tener al menos un carácter especial.
            </Text>
          </View>
        )}
        <TextInput
          style={[styles.input, rutError ? styles.invalidInput : null]}
          placeholder="RUT"
          value={rut}
          onChangeText={(text) => {
            const formattedRut = formatRut(text);
            if (formattedRut.length <= 12) {
              setRut(formattedRut);
            }
          }}
          keyboardType="default"
          onBlur={() => {
            if (rut.trim() === '') {
              setRutError('El campo de RUT es obligatorio.');
              clearError(setRutError);
            } else if (!validateRut(rut)) {
              setRutError('El RUT no es válido.');
              clearError(setRutError);
            } else {
              setRutError('');
            }
          }}
        />
        {rutError ? <Text style={styles.errorText}>{rutError}</Text> : null}
        <TextInput
          style={[styles.input, edadError ? styles.invalidInput : null]}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          onBlur={() => {
            if (edad.trim() === '') {
              setEdadError('El campo de edad es obligatorio.');
              clearError(setEdadError);
            } else if (!validateAge(edad)) {
              setEdadError('La edad no es válida.');
              clearError(setEdadError);
            }
          }}
          keyboardType="numeric"
        />
        {edadError ? <Text style={styles.errorText}>{edadError}</Text> : null}
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <Text style={styles.switchScreenText}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
          <Text style={styles.linkText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;
