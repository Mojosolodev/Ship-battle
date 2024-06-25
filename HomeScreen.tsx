/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import auth from "@react-native-firebase/auth"
import SignUpScreen from './SignUp';

const Home=({navigation})=>{

  const gomodeAI = () => {
    //for next navigation
    navigation.navigate("ModeAI")
  };
  const gomodePlayer = () => {
    //for next navigation
    navigation.navigate("ModeAI")
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bataille Navale</Text>
        <TouchableOpacity style={styles.button} onPress={gomodePlayer}>
          <Text style={styles.buttonText}>Player VS Player</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={gomodeAI}>
          <Text style={styles.buttonText}>Player VS AI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default Home;