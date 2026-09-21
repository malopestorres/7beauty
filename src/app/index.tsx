import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Brand, Typography } from '@/constants/theme';
import { auth } from '@/lib/firebase';
import { isRemembered } from '@/lib/session';

const SPLASH_DURATION_MS = 1200;

export default function SplashScreen() {
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      const user = auth.currentUser;
      const remember = await isRemembered();
      let target: '/login' | '/(tabs)' = '/login';
      if (user && remember) {
        target = '/(tabs)';
      } else if (user) {
        // "Lembre-me" desmarcado: não mantém a sessão ao reabrir o app.
        await signOut(auth);
      }
      if (active) {
        router.replace(target);
      }
    }, SPLASH_DURATION_MS);
    return () => {
      active = false;
      clearTimeout(timer);
    };
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