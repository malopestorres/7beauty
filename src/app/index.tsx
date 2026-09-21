import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>7Beauty</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: Brand.primary,
    fontSize: 64,
    fontWeight: '700',
  },
});