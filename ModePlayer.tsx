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
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ModePlayer = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const { email } = route.params || {};
  const { documentKey } = route.params || {};

  const getData = async () => {
    const usersCollection = await firestore().collection('users').get();
    setUsers(usersCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getData();
  }, []);

  const showUserInfo = async (user) => {
    const userDoc = await firestore().collection('users').doc(user.id).get();
    Alert.alert('User Info', `Email: ${user.email}\nDocument Key: ${userDoc.id}`);
  };

  React.useEffect(() => {
    if (email) {
      Alert.alert('key', documentKey);
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Other Players</Text>
        {users.filter((user) => user.email !== email).map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => showUserInfo(user)}
          >
            <Text style={styles.buttonText}>{user.email}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 10,
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ModePlayer;