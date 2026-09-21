import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged, User } from 'firebase/auth';

import { Salon, SalonCard } from '@/components/salon-card';
import { Brand, Typography } from '@/constants/theme';
import { useFavorites, useSalons } from '@/hooks/use-salons';
import { auth } from '@/lib/firebase';

export default function ListScreen() {
  const salons = useSalons();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const { favoriteIds, toggleFavorite } = useFavorites(user);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return salons;
    }
    return salons.filter((salon) => {
      const haystack =
        `${salon.name} ${salon.address} ${salon.city} ${salon.state} ${salon.services.join(' ')}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [salons, search]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>Lista de salões</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={13} color="#6B6B6B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Braga , Portugal"
            placeholderTextColor="#B0B0B0"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SalonCard
            salon={item}
            isFavorite={favoriteIds.has(item.id)}
            onToggleFavorite={(salon: Salon) => toggleFavorite(salon)}
            onPress={(salon: Salon) => router.push(`/salon/${salon.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 24,
    paddingTop: 40,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.white,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.white,
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 13,
    width: 335,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    height: '100%',
  },
  listContent: {
    padding: 20,
    paddingBottom: 32,
  },
  separator: {
    height: 28,
  },
});