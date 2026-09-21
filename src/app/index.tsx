import { router } from 'expo-router';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Brand, Typography } from '@/constants/theme';

const SPLASH_DURATION_MS = 1200;

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/splash-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.logoGroup}>
        <Text style={styles.logo}>
          <Text style={styles.logoAccent}>7</Text>
          Beauty
        </Text>
        <Text style={styles.subtitle}>GUIA DE SALÕES BRASILEIROS</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Brand.black,
  },
  logoGroup: {
    position: 'absolute',
    top: 36,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 40,
  },
  logo: {
    fontFamily: Typography.display,
    fontSize: Typography.sizes.display,
    lineHeight: 66,
    color: Brand.black,
  },
  logoAccent: {
    color: Brand.primary,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.body,
    color: Brand.black,
    letterSpacing: 1,
    textAlign: 'center',
  },
});