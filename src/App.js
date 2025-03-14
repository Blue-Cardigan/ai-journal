import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './config/supabase';
import { Button } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import JournalEntryScreen from './screens/JournalEntryScreen';
import ChatScreen from './screens/ChatScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={session ? "Home" : "Auth"}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#A1CEDC',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!session ? (
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen} 
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ 
                  title: 'My Journal',
                  headerRight: () => (
                    <Button
                      onPress={() => supabase.auth.signOut()}
                      title="Sign Out"
                      color="#000"
                    />
                  ),
                }}
              />
              <Stack.Screen 
                name="JournalEntry" 
                component={JournalEntryScreen} 
                options={{ title: 'New Entry' }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={{ title: 'AI Chat' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 