import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Typography } from '@/constants/theme';

export type Professional = {
  name: string;
  photoUrl: string;
};

export type Salon = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  priceTo: number;
  services: string[];
  openingHours: string;
  isOpen: boolean;
  imageUrl: string;
  description?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  coverUrl?: string;
  professionals?: Professional[];
  products?: string[];
};

type Props = {
  salon: Salon;
  isFavorite: boolean;
  onToggleFavorite: (salon: Salon) => void;
  onPress: (salon: Salon) => void;
};

export function SalonCard({ salon, isFavorite, onToggleFavorite, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(salon)}>
      <Image
        source={{ uri: salon.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {salon.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {salon.services.join(' · ')}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {salon.address} · {salon.city}, {salon.state}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.iconGroup}>
            <Ionicons name="call-outline" size={12} color="#C4C4C4" />
            <Ionicons name="logo-whatsapp" size={12} color="#C4C4C4" />
          </View>
          <Text style={[styles.status, salon.isOpen ? styles.statusOpen : styles.statusClosed]}>
            {salon.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>
      </View>
      <Pressable style={styles.favorite} onPress={() => onToggleFavorite(salon)} hitSlop={10}>
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={22}
          color={isFavorite ? Brand.primary : '#C4C4C4'}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Brand.white,
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 86,
  },
  image: {
    width: 75,
    minHeight: 86,
    backgroundColor: '#F0F0F3',
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 2,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Brand.black,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: '#333333',
  },
  address: {
    fontFamily: Typography.body,
    fontSize: 10,
    color: '#6B6B6B',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  status: {
    fontFamily: Typography.body,
    fontSize: 9,
  },
  statusOpen: {
    color: '#61B838',
  },
  statusClosed: {
    color: '#FF6161',
  },
  favorite: {
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
});