import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Typography } from '@/constants/theme';
import { auth } from '@/lib/firebase';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut(auth);
    Alert.alert('Até mais!', 'Você saiu da sua conta.');
    router.replace('/login');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Brand.white} />
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] ?? 'Visitante'}</Text>
        <Text style={styles.email}>{user?.email ?? 'Você não está conectado.'}</Text>

        <Pressable
          style={styles.logoutButton}
          onPress={user ? handleLogout : () => router.replace('/login')}
        >
          <Text style={styles.logoutText}>{user ? 'Sair da conta' : 'Entrar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  header: {
    backgroundColor: Brand.black,
    paddingTop: 72,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.white,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
    paddingHorizontal: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: Typography.bodyMedium,
    fontSize: 20,
    color: Brand.black,
  },
  email: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: '#6B6B6B',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: Brand.black,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  logoutText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
  },
});