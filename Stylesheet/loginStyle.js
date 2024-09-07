import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFEBCD', // Fondo blanco
  },
  scrollContainer: {
    flex: 1,
    margin: 10, // Margen alrededor del contenido
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',  // Ancho limitado a su contenedor
    height: 700,    // Definir altura limitada, ajusta según necesidad
    borderRadius: 17, // Bordes redondeados opcionales
    overflow: 'hidden', // Evitar que el contenido se salga de los bordes
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Capa semitransparente
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 18,
    backgroundColor: '#e6ffe6',
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'green',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchScreenText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'white',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: 'yellow',
    fontSize: 16,
  },
});
