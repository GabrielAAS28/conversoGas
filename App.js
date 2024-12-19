import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // 2 segundos de loading

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [alcool, setAlcool] = useState('');
  const [gasolina, setGasolina] = useState('');

  const calcularVantagem = () => {
    Keyboard.dismiss();
    const precoAlcool = parseFloat(alcool);
    const precoGasolina = parseFloat(gasolina);

    if (isNaN(precoAlcool) || isNaN(precoGasolina)) {
      alert('Por favor, insira valores válidos para ambos os combustíveis.');
      return;
    }

    const calculo = precoAlcool / precoGasolina;

    const resultado = {
      mensagem: calculo < 0.7 ? 'Compensa usar Álcool' : 'Compensa usar Gasolina',
      cor: calculo < 0.7 ? '#28a745' : '#D35400',
      imagem: calculo < 0.7 ? require('./src/images/gas.png') : require('./src/images/logo.png'),
      alcool: precoAlcool,
      gasolina: precoGasolina,
    };

    navigation.navigate('Resultado', { resultado });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('./src/images/logo.png')} style={styles.image} />
        <Text style={styles.title}>Qual melhor opção?</Text>

        <Text style={styles.label}>Álcool (preço por litro):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={alcool}
          onChangeText={setAlcool}
          placeholder="Ex: 4.60"
        />

        <Text style={styles.label}>Gasolina (preço por litro):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={gasolina}
          onChangeText={setGasolina}
          placeholder="Ex: 7.30"
        />

        <TouchableOpacity style={styles.button} onPress={calcularVantagem}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ResultadoScreen({ route, navigation }) {
  const { resultado } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={resultado.imagem} style={styles.image} />
        <Text style={[styles.resultText, { color: resultado.cor }]}>{resultado.mensagem}</Text>
        <Text style={styles.pricesText}>Com os preços:</Text>
        <Text style={styles.priceDetail}>Álcool: R$ {resultado.alcool.toFixed(2)}</Text>
        <Text style={styles.priceDetail}>Gasolina: R$ {resultado.gasolina.toFixed(2)}</Text>

        <TouchableOpacity style={styles.buttonReset} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonResetText}>Calcular novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Calculadora', headerLeft: () => null }} />
        <Stack.Screen
          name="Resultado"
          component={ResultadoScreen}
          options={{
            title: 'Resultado',
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pricesText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  priceDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  buttonReset: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonResetText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
