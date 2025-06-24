import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { supabase } from './supabase';

export default function App() {
  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .then(({ data, error }) => {
        console.log('Profiles:', data, 'Error:', error);
      });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Flinch Mobile App Connected to Supabase!</Text>
    </View>
  );
}