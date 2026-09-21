import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand, Typography } from '@/constants/theme';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.logoAccent}>7</Text>
        Beauty
      </Text>
      <Text style={styles.hint}>Login em breve</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.black,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logo: {
    fontFamily: Typography.display,
    fontSize: 48,
    color: Brand.white,
  },
  logoAccent: {
    color: Brand.primary,
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.body,
    color: Brand.textSecondary,
  },
});