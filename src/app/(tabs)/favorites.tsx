import { onAuthStateChanged, User } from 'firebase/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Salon, SalonCard } from '@/components/salon-card';
import { Brand, Typography } from '@/constants/theme';
import { useFavorites, useSalons } from '@/hooks/use-salons';
import { auth } from '@/lib/firebase';

export default function FavoritesScreen() {
  const salons = useSalons();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const { favoriteIds, toggleFavorite } = useFavorites(user);
  const favorites = salons.filter((salon) => favoriteIds.has(salon.id));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum salão favorito ainda.</Text>
          <Text style={styles.emptyHint}>Toque na estrela na lista de salões para guardar aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SalonCard
              salon={item}
              isFavorite
              onToggleFavorite={(salon: Salon) => toggleFavorite(salon)}
              onPress={(salon: Salon) => router.push(`/salon/${salon.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 32,
  },
  emptyText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.black,
  },
  emptyHint: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 32,
  },
  separator: {
    height: 28,
  },
});