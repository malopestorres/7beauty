import { useCallback, useSyncExternalStore } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import { Salon } from '@/components/salon-card';
import { db } from '@/lib/firebase';

function parseSalon(id: string, data: Record<string, unknown>): Salon {
  return {
    id,
    name: String(data.name ?? ''),
    address: String(data.address ?? ''),
    city: String(data.city ?? ''),
    state: String(data.state ?? ''),
    rating: Number(data.rating ?? 0),
    reviewsCount: Number(data.reviewsCount ?? 0),
    priceFrom: Number(data.priceFrom ?? 0),
    priceTo: Number(data.priceTo ?? 0),
    services: Array.isArray(data.services) ? (data.services as string[]) : [],
    openingHours: String(data.openingHours ?? ''),
    isOpen: Boolean(data.isOpen),
    imageUrl: String(data.imageUrl ?? ''),
  };
}

// ---------------------------------------------------------------------------
// Store de salões (leitura pública no Firestore)
// ---------------------------------------------------------------------------

let salonsCache: Salon[] = [];
const salonsListeners = new Set<() => void>();
let salonsUnsubscribe: Unsubscribe | null = null;

function notifySalons() {
  salonsListeners.forEach((listener) => listener());
}

function ensureSalonsListening() {
  if (salonsUnsubscribe) {
    return;
  }
  const q = query(collection(db, 'salons'));
  salonsUnsubscribe = onSnapshot(q, (snapshot) => {
    salonsCache = snapshot.docs.map((doc) =>
      parseSalon(doc.id, doc.data() as Record<string, unknown>),
    );
    notifySalons();
  });
}

export function useSalons(): Salon[] {
  return useSyncExternalStore(
    (callback) => {
      ensureSalonsListening();
      salonsListeners.add(callback);
      return () => {
        salonsListeners.delete(callback);
      };
    },
    () => salonsCache,
    () => salonsCache,
  );
}

// ---------------------------------------------------------------------------
// Store de favoritos (por usuário)
// ---------------------------------------------------------------------------

type FavoritesStore = {
  ids: Set<string>;
  listeners: Set<() => void>;
  unsubscribe: Unsubscribe | null;
};

const favoritesStores = new Map<string, FavoritesStore>();
const EMPTY_IDS = new Set<string>();

function getFavoritesStore(userId: string): FavoritesStore {
  let store = favoritesStores.get(userId);
  if (!store) {
    store = { ids: EMPTY_IDS, listeners: new Set(), unsubscribe: null };
    favoritesStores.set(userId, store);
  }
  if (!store.unsubscribe) {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    store.unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = new Set<string>();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (typeof data.salonId === 'string') {
          ids.add(data.salonId);
        }
      });
      store.ids = ids;
      store.listeners.forEach((listener) => listener());
    });
  }
  return store;
}

function favoriteId(userId: string, salonId: string) {
  return `${userId}_${salonId}`;
}

export function useFavorites(user: User | null) {
  const userId = user?.uid ?? '';

  const ids = useSyncExternalStore(
    (callback) => {
      if (!userId) {
        return () => {};
      }
      const store = getFavoritesStore(userId);
      store.listeners.add(callback);
      return () => {
        store.listeners.delete(callback);
      };
    },
    () => (userId ? getFavoritesStore(userId).ids : EMPTY_IDS),
    () => (userId ? getFavoritesStore(userId).ids : EMPTY_IDS),
  );

  const toggleFavorite = useCallback(
    (salon: Salon) => {
      if (!userId) {
        return;
      }
      const id = favoriteId(userId, salon.id);
      const ref = doc(db, 'favorites', id);
      if (ids.has(salon.id)) {
        deleteDoc(ref);
      } else {
        setDoc(ref, {
          userId,
          salonId: salon.id,
          createdAt: new Date(),
        });
      }
    },
    [ids, userId],
  );

  return { favoriteIds: ids, toggleFavorite };
}