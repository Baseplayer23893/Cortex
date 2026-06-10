import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await signUp.create({ emailAddress: email, password });
      if (error) throw error;
      if (signUp.status === 'missing_requirements') {
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) throw sendError;
        setPending(true);
      } else if (signUp.status === 'complete') {
        await signUp.finalize();
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      Alert.alert('Error', e.errors?.[0]?.message || e.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) throw error;
      if (signUp.status === 'complete') {
        await signUp.finalize();
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      Alert.alert('Error', e.errors?.[0]?.message || e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>VERIFY</Text>
        <Text style={styles.subtitle}>Enter the code sent to {email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Verification code"
          placeholderTextColor="#555"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? '...' : 'VERIFY'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CORTEX</Text>
      <Text style={styles.subtitle}>Create your account</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '...' : 'SIGN UP'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/sign-in')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
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
