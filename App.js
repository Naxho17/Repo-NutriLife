import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import ProductosScreen from './screens/ProductosScreen';

// Crear navegadores
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomTabBarIcon({ route, focused }) {
  const iconName = route.name === 'Productos' ? 'cart-outline' :
                   route.name === 'Documentos' ? 'document-text-outline' :
                   'person-outline';

  return (
    <View style={styles.iconContainer}>
      {focused && (
        <View style={styles.curveContainer}>
          <View style={styles.curve} />
        </View>
      )}
      <Ionicons name={iconName} size={24} color={focused ? '#42f44b' : 'gray'} />
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <CustomTabBarIcon route={route} focused={focused} />,
        tabBarActiveTintColor: '#42f44b',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="Productos" component={ProductosScreen} />
      <Tab.Screen name="Documentos" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={HomeScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#000',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  curveContainer: {
    position: 'absolute',
    top: -16, // Levantar la curva por encima del icono
    width: 57, // Aumentar el ancho de la curva
    height: 35, // Aumentar la altura para un arco más suave
    alignItems: 'center',
    justifyContent: 'center',
  },
  curve: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderBottomLeftRadius: 30, // Suavizar la curva
    borderBottomRightRadius: 30, // Suavizar la curva
    borderTopLeftRadius: 60, // Curva más suave en la parte superior
    borderTopRightRadius: 60, // Curva más suave en la parte superior
  },
});

export default App;
