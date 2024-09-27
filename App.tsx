import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession(); // Required for Expo Go

const App = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID', // For Expo Go
    iosClientId: 'YOUR_IOS_CLIENT_ID', // For iOS standalone app
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // For Android standalone app
    webClientId: 'YOUR_WEB_CLIENT_ID', // For web and standalone apps
  });

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <Text>Welcome, {userInfo.name}</Text>
      ) : (
        <Button
          disabled={!request}
          title="Sign in with Google"
          onPress={() => {
            promptAsync();
          }}
        />
      )}
    </View>
  );
};

export default App;
