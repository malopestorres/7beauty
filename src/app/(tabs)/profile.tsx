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

  function handleEditPhoto() {
    Alert.alert('Em breve', 'Trocar foto de perfil chega em uma próxima versão.');
  }

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Visitante';
  const initial = (displayName.charAt(0) ?? '?').toUpperCase();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            <Pressable style={styles.cameraBadge} onPress={handleEditPhoto} hitSlop={6}>
              <Ionicons name="camera" size={16} color={Brand.white} />
            </Pressable>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value} numberOfLines={1}>
            {user?.email ?? 'Não conectado'}
          </Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>Não informado</Text>
        </View>
        <View style={styles.separator} />

        <Pressable style={styles.infoRow} onPress={user ? handleLogout : () => router.replace('/login')}>
          <Text style={styles.label}>Sair</Text>
          <Text style={styles.value}>{user ? 'Logout da conta' : 'Entrar'}</Text>
        </Pressable>
        <View style={styles.separator} />
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
    height: 77,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.black,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarBox: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: Typography.display,
    fontSize: 44,
    color: Brand.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    gap: 12,
  },
  label: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: '#6B6B6B',
  },
  value: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
});