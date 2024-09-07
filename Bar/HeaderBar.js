import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderBar = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>NutriLife</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: '#0f8341',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'Century',
  },
});

export default HeaderBar;
