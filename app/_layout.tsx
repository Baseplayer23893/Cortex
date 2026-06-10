import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { publishableKey, tokenCache } from '../lib/clerk';
import { setSupabaseToken } from '../lib/supabase';
import Celebration from '../components/Celebration';

const queryClient = new QueryClient();

if (typeof document !== 'undefined' && !document.getElementById('clerk-captcha')) {
  const el = document.createElement('div');
  el.id = 'clerk-captcha';
  el.style.display = 'none';
  document.body.appendChild(el);
}

if (typeof document !== 'undefined') {
  const cspMetaRemover = new MutationObserver(() => {
    document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(el => {
      el.remove();
    });
  });
  cspMetaRemover.observe(document.head, { childList: true, subtree: true });
}

const LOADING_TIMEOUT = 10000;

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || redirected) return;
    if (!isSignedIn) {
      setRedirected(true);
      router.replace('/sign-in');
      return;
    }
    getToken({ template: 'supabase' }).then((token) => {
      if (token) setSupabaseToken(token);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, redirected]);

  if (!isLoaded) {
    if (timedOut) {
      return (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>CORTEX</Text>
          <Text style={styles.errorText}>
            Failed to initialize. Check that Clerk publishable key is configured in Vercel environment
            variables and disable any ad blockers for this site.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>CORTEX</Text>
        <ActivityIndicator size="small" color="#737373" />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.style.colorScheme = 'dark';
    }
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} proxyUrl="/api/clerk">
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <Slot />
          <Celebration />
        </AuthGate>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontSize: 24, color: '#F5F5F5', fontFamily: 'monospace', letterSpacing: 4 },
  errorText: { fontSize: 14, color: '#A3A3A3', fontFamily: 'monospace', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});
