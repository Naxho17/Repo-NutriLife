import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image, Animated, Dimensions } from 'react-native';
import axios from 'axios';

const ProductosScreen = () => {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const sadFaceAnim = useRef(new Animated.Value(0)).current; // Para la animación de carita triste
  const happyFaceAnim = useRef(new Animated.Value(1)).current; // Para la animación de carita feliz

  const buscarProductos = async () => {
    if (!search.trim()) {
      setError('Busca un producto.');
      return;
    }

    setError('');
    setLoading(true);
    setProductos([]);

    try {
      const response = await axios.get(`http://192.168.1.86:4000/api/products/search?search=${search}`);
      setProductos(response.data);

      if (response.data.length === 0) {
        // Si no hay productos, muestra la carita triste
        Animated.spring(sadFaceAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      } else {
        // Oculta la carita triste si hay productos
        Animated.spring(sadFaceAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      setError('Error al buscar productos. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (item) => {
    setSelectedProduct(item);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => startBounceAnimation());
  };

  const closeDetails = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedProduct(null));
  };

  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const renderItem = ({ item }) => {
    const { nombre_producto, azucares, carbohidratos, grasas, proteinas, energia_kcal, imagen } = item;
  
    return (
      <TouchableOpacity onPress={() => selectProduct(item)}>
        <View style={styles.productItem}>
          <Image
            source={{ uri: imagen }}
            style={styles.productImage}
          />
          <Text style={styles.productTitle}>{nombre_producto}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Busca un producto"
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          Animated.spring(happyFaceAnim, {
            toValue: text ? 0 : 1, // Si hay texto, oculta la carita feliz
            useNativeDriver: true,
          }).start();
        }}
      />

      <TouchableOpacity style={styles.searchButton} onPress={buscarProductos}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Animated.View style={[styles.sadFaceContainer, { opacity: sadFaceAnim }]}>
              <Text style={styles.sadFaceText}>😔 No se encontraron productos.</Text>
            </Animated.View>
          }
        />
      )}

      {!search && (
        <Animated.View style={[styles.happyFaceContainer, { opacity: happyFaceAnim }]}>
          <Text style={styles.happyFaceText}>😀 Busca un producto</Text>
        </Animated.View>
      )}

      {selectedProduct && (
        <Animated.View style={[
          styles.productDetailsContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.productDetailsContent}>
            <Text style={styles.productDetailText}>Producto: {selectedProduct.nombre_producto}</Text>
            <Text style={styles.productDetailText}>Calorías: {selectedProduct.energia_kcal} kcal</Text>
            <Text style={styles.productDetailText}>Azúcares: {selectedProduct.azucares} g</Text>
            <Text style={styles.productDetailText}>Grasas: {selectedProduct.grasas} g</Text>
            <Text style={styles.productDetailText}>Carbohidratos: {selectedProduct.carbohidratos} g</Text>
            <Text style={styles.productDetailText}>Proteínas: {selectedProduct.proteinas} g</Text>

            <TouchableOpacity onPress={closeDetails}>
              <Animated.Text style={[styles.closeText, { transform: [{ translateY: bounceAnim }] }]}>
                Cerrar
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  sadFaceContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  sadFaceText: {
    fontSize: 24,
    color: '#555',
  },
  happyFaceContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  happyFaceText: {
    fontSize: 24,
    color: '#555',
  },
  productDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  productDetailsContent: {
    alignItems: 'center',
  },
  productDetailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ProductosScreen;
