/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
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
import firestore from '@react-native-firebase/firestore';


const SignUp=({navigation})=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  
  const signUpTestFn=()=>{
    if(email && password)
    auth().createUserWithEmailAndPassword(email,password).then(()=>{
      Alert.alert("User created");
      firestore().collection("users").add({
        email:email,
        positionX:0,
        positionY:0,
        opponentKey:"",
        userKey:""
      })
      navigation.navigate("Login")
    })
    .catch((err=>{
      console.log(err)
      Alert.alert(err.message)
    }))
    else
    {
      Alert.alert("Enter email and Password")
    }
  }

  const goLogin = () => {
    // Add your login logic here
    navigation.navigate("Login")
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text=>setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password( au moins 6 x-ters)"
          value={password}
          onChangeText={text=>setPassword(text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={signUpTestFn}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={goLogin}>
          <Text style={styles.loginText}>Login Instead</Text>
        </TouchableWithoutFeedback>
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

export default SignUp;