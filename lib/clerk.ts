const createTokenCache = () => {
  if (typeof document !== 'undefined') {
    return {
      getToken: async (key: string) => localStorage.getItem(key),
      saveToken: async (key: string, token: string) => localStorage.setItem(key, token),
    };
  }
  const SecureStore = require('expo-secure-store');
  return {
    getToken: async (key: string) => SecureStore.getItemAsync(key),
    saveToken: async (key: string, token: string) => SecureStore.setItemAsync(key, token),
  };
};

export const tokenCache = createTokenCache();

const rawKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!rawKey) {
  console.error(
    '[CORTEX] Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. ' +
      'Ensure it is set in Vercel project settings under "Environment Variables".'
  );
}
export const publishableKey = rawKey || '';
