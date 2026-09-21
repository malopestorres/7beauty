import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand, Typography } from '@/constants/theme';
import { useFavorites, useSalon } from '@/hooks/use-salons';
import { auth } from '@/lib/firebase';

function digitsOnly(value?: string) {
  return value?.replace(/\D/g, '') ?? '';
}

export default function SalonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const salon = useSalon(id);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const { favoriteIds, toggleFavorite } = useFavorites(user);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  function openContact(kind: 'whatsapp' | 'phone' | 'email') {
    if (!salon) {
      return;
    }
    let url = '';
    if (kind === 'whatsapp' && salon.whatsapp) {
      url = `https://wa.me/${digitsOnly(salon.whatsapp)}`;
    } else if (kind === 'phone' && salon.phone) {
      url = `tel:${digitsOnly(salon.phone)}`;
    } else if (kind === 'email' && salon.email) {
      url = `mailto:${salon.email}`;
    }

    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert('Ops', 'Não foi possível abrir este contato.'),
      );
    } else {
      Alert.alert('Sem contato', 'Este salão ainda não informou esse canal.');
    }
  }

  if (!salon) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  const isFavorite = favoriteIds.has(salon.id);
  const statusColor = salon.isOpen ? '#61B838' : '#FF6161';
  const cover = salon.coverUrl || salon.imageUrl;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Image source={{ uri: cover }} style={styles.cover} contentFit="cover" transition={250} />

        <View style={styles.topBar}>
          <Pressable onPress={goBack} hitSlop={10} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Brand.black} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>
              {salon.name}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={11} color={statusColor} />
              <Text style={[styles.status, { color: statusColor }]}>
                {salon.isOpen ? 'Aberto' : 'Fechado'}
              </Text>
            </View>
          </View>

          <Text style={styles.address}>
            {salon.address}
            {'\n'}
            {salon.city}, {salon.state}
          </Text>

          <Pressable
            style={styles.favorite}
            onPress={() => toggleFavorite(salon)}
            hitSlop={10}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? Brand.primary : '#C4C4C4'}
            />
          </Pressable>

          <Text style={styles.description}>
            {salon.description ?? salon.services.join(' · ')}
          </Text>

          {salon.professionals && salon.professionals.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Profissionais</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.professionalsRow}
              >
                {salon.professionals.map((professional) => (
                  <View key={professional.name} style={styles.professional}>
                    {professional.photoUrl ? (
                      <Image
                        source={{ uri: professional.photoUrl }}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.avatarFallback]}>
                        <Text style={styles.avatarInitial}>
                          {professional.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.professionalName} numberOfLines={1}>
                      {professional.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}

          {salon.products && salon.products.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Produtos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsRow}
              >
                {salon.products.map((product, index) => (
                  <Image
                    key={`${product}-${index}`}
                    source={{ uri: product }}
                    style={styles.productImage}
                    contentFit="cover"
                    transition={200}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Contatos</Text>
          <View style={styles.contacts}>
            <Pressable style={styles.contactButton} onPress={() => openContact('whatsapp')}>
              <Text style={styles.contactButtonText}>Chamar no Whatsapp</Text>
            </Pressable>
            <Pressable style={styles.contactButton} onPress={() => openContact('phone')}>
              <Text style={styles.contactButtonText}>Telefonar</Text>
            </Pressable>
            <Pressable style={styles.contactButton} onPress={() => openContact('email')}>
              <Text style={styles.contactButtonText}>Enviar Email</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  loading: {
    flex: 1,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: '100%',
    height: 184,
    backgroundColor: '#F0F0F3',
  },
  topBar: {
    height: 53,
    backgroundColor: Brand.white,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontFamily: Typography.bodyMedium,
    fontSize: 24,
    color: Brand.black,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  status: {
    fontFamily: Typography.body,
    fontSize: 11,
  },
  address: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 16,
    marginTop: 8,
  },
  favorite: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: Typography.body,
    fontSize: 18,
    color: Brand.black,
    marginTop: 40,
    marginBottom: 16,
  },
  professionalsRow: {
    gap: 15,
  },
  professional: {
    alignItems: 'center',
    width: 69,
  },
  avatar: {
    width: 69,
    height: 69,
    borderRadius: 35,
    backgroundColor: '#F0F0F3',
  },
  avatarFallback: {
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: Typography.bodyMedium,
    fontSize: 26,
    color: Brand.white,
  },
  professionalName: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Brand.black,
    marginTop: 6,
  },
  productsRow: {
    gap: 8,
  },
  productImage: {
    width: 95,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#F0F0F3',
  },
  contacts: {
    gap: 16,
  },
  contactButton: {
    backgroundColor: Brand.black,
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
  },
});