import React, { useEffect } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useSupabaseUser } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, error } = useSupabaseUser();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)');
    }
  }, [loading, user, router]);

  const handleSignInWithGoogle = async () => {
    console.log('[auth] handleSignInWithGoogle called');
    const redirectTo = AuthSession.makeRedirectUri({
      scheme: 'gymkaana',
      path: 'auth/callback',
    });
    console.log('[auth] redirectTo', redirectTo);

    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (signInError) {
      console.error('[auth] Google sign-in error', signInError);
      Alert.alert('Google sign-in error', String(signInError.message ?? signInError));
      return;
    }

    if (data?.url) {
      console.log('[auth] Opening OAuth URL', data.url);
      try {
        await Linking.openURL(data.url);
      } catch (e) {
        console.error('[auth] Linking.openURL error', e);
        Alert.alert('Error', 'Could not open browser for Google sign-in.');
      }
    } else {
      console.log('[auth] signInWithOAuth returned without URL');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>Gymkaana</Text>
        <Text style={styles.subtitle}>Personalised strength training, saved per set.</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable
          style={styles.buttonPrimary}
          onPress={() => {
            console.log('[auth] Continue with Google pressed; loading =', loading);
            if (!loading) {
              handleSignInWithGoogle();
            }
          }}
        >
          <Text style={styles.buttonPrimaryText}>
            {loading ? 'Checking session…' : 'Continue with Google'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f5f5f5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
    marginBottom: 32,
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonPrimary: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#f97316',
  },
  buttonPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});

