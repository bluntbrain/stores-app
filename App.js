import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {primaryColor} from './src/config/constants';
import HomeScreen from './src/pages/HomeScreen';
import LoginScreen from './src/pages/LoginScreen/index';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthContext} from './src/components/context';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async foundUser => {
        setUserToken('fgkj');
        setIsLoading(false);
      },
      signOut: async () => {
        setUserToken(null);
        setIsLoading(false);
        ToastAndroid.show('Signout success!', ToastAndroid.LONG)
      },
    }),
    [],
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={'#000000'} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken != null ? <HomeScreen /> : <LoginScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
