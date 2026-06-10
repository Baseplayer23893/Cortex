import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signIn.create({ identifier: email, password });
      if (error) throw error;
      if (signIn.status === 'complete') {
        await signIn.finalize();
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      Alert.alert('Error', e.errors?.[0]?.message || e.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CORTEX</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#555"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '...' : 'SIGN IN'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/sign-up')}>
        <Text style={styles.link}>Don&apos;t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, color: '#F5F5F5', fontFamily: 'monospace', textAlign: 'center', letterSpacing: 4, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#737373', fontFamily: 'monospace', textAlign: 'center', marginBottom: 48 },
  input: { borderWidth: 1, borderColor: '#262626', borderRadius: 4, padding: 14, color: '#F5F5F5', fontFamily: 'monospace', fontSize: 14, marginBottom: 12 },
  button: { backgroundColor: '#F5F5F5', borderRadius: 4, padding: 14, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#0A0A0A', fontFamily: 'monospace', fontSize: 14, letterSpacing: 2 },
  link: { color: '#737373', fontFamily: 'monospace', fontSize: 12, textAlign: 'center', marginTop: 24 },
});
