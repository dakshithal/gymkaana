import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useSupabaseUser } from '@/lib/auth';

export default function TabTwoScreen() {
  const { user, loading, error } = useSupabaseUser();

  const handleSignInWithGoogle = async () => {
    const redirectTo = 'gymkaana://auth/callback';
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
    if (signInError) {
      console.error('[auth] Google sign-in error', signInError);
    }
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error('[auth] sign-out error', signOutError);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      {loading ? (
        <Text style={styles.muted}>Checking session…</Text>
      ) : user ? (
        <>
          <Text style={styles.muted}>
            Signed in as {user.email ?? user.id.slice(0, 8) + '…'}
          </Text>
          <Pressable style={styles.buttonSecondary} onPress={handleSignOut}>
            <Text style={styles.buttonSecondaryText}>Sign out</Text>
          </Pressable>
        </>
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable style={styles.buttonPrimary} onPress={handleSignInWithGoogle}>
            <Text style={styles.buttonPrimaryText}>Continue with Google</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0f0f0f',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#f5f5f5',
  },
  muted: {
    fontSize: 14,
    color: '#a3a3a3',
    marginBottom: 16,
    textAlign: 'center',
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
  buttonSecondary: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#404040',
  },
  buttonSecondaryText: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '600',
  },
});
