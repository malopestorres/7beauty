import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand, Typography } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
        <Ionicons name="arrow-back" size={24} color={Brand.white} />
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>Cadastre seu salão</Text>
        <Text style={styles.hint}>
          O formulário completo de cadastro de salão chega em breve.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.black,
  },
  back: {
    padding: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: Typography.bodyMedium,
    fontSize: 20,
    color: Brand.white,
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
});