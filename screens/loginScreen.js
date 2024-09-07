import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBar from '../Bar/HeaderBar';
import { validateEmail, validatePassword } from '../validation/validationRegister';
import styles from '../Stylesheet/loginStyle';

// Importamos la imagen
import backgroundImage from '../IMG/HD-wallpaper-Madera_multicolor.jpg'; // Ajusta la ruta según tu archivo

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailError('');
      setPasswordError('');
    }, 1500);
    return () => clearTimeout(timer);
  }, [emailError, passwordError]);

  useEffect(() => {
    return () => {
      setSuccessMessage('');
      setBackendError('');
    };
  }, [navigation]);

  const handleLogin = async () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setBackendError('');

    if (email.trim() === '') {
      setEmailError('El correo es requerido.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('El correo no es válido.');
      valid = false;
    }

    if (contraseña.trim() === '') {
      setPasswordError('La contraseña es requerida.');
      valid = false;
    } else if (contraseña.length < 6) {
      setPasswordError('La contraseña es muy corta.');
      valid = false;
    }

    if (!valid) {
      setLoginAttempts(prev => prev + 1);
      return;
    }

    try {
      const response = await fetch('http://192.168.1.86:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contraseña })
      });

      const result = await response.json();
      if (response.ok) {
        setLoginAttempts(0);
        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userId', result.userId);
        setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
        setEmail('');
        setContraseña('');

        setTimeout(() => {
          setSuccessMessage('');
          navigation.navigate('Home');
        }, 2000);

      } else {
        setLoginAttempts(prev => prev + 1);
        setBackendError(result.message || "Error desconocido.");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setBackendError("Error de Conexión: No se pudo conectar al servidor.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <HeaderBar />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <ImageBackground
          source={backgroundImage} // Usamos la imagen importada
          style={styles.backgroundImage} // Estilo limitado de la imagen
        >
          <View style={styles.overlay}>
            {backendError ? <Text style={styles.errorText}>{backendError}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <TextInput
              style={[styles.input, emailError ? styles.invalidInput : null]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <TextInput
              style={[styles.input, passwordError ? styles.invalidInput : null]}
              placeholder="Contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <Text style={styles.switchScreenText}>¿No estás registrado?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>Registrarse</Text>
            </TouchableOpacity>

            {loginAttempts >= 2 && (
              <>
                <Text style={styles.switchScreenText}>¿Olvidaste tu contraseña?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Restablecer')}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>Restablecer contraseña</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
