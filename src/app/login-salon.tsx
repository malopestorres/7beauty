import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand, Typography } from '@/constants/theme';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { auth } from '@/lib/firebase';
import { setRememberMe as persistRememberMe } from '@/lib/session';

export default function LoginSalonScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Atenção', 'Preencha o email e uma senha com pelo menos 6 caracteres.');
      return;
    }
    setIsSubmitting(true);
    try {
      await persistRememberMe(rememberMe);
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (error) {
        const code = (error as FirebaseError).code;
        if (code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email.trim(), password);
        } else {
          throw error;
        }
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', getAuthErrorMessage(error as FirebaseError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu email no campo acima para recuperar a senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Feito!', `Enviamos um link de redefinição para ${email.trim()}.`);
    } catch (error) {
      Alert.alert('Erro', getAuthErrorMessage(error as FirebaseError));
    }
  }

  function handleSocial() {
    Alert.alert('Em breve', 'Login com Google e Facebook chega em uma próxima versão.');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastre seu salão</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6B6B6B"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6B6B6B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <View style={styles.actionsRow}>
          <Pressable style={styles.rememberRow} onPress={() => setRememberMe((value) => !value)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Ionicons name="checkmark" size={16} color={Brand.white} />}
            </View>
            <Text style={styles.rememberText}>Lembre-me</Text>
          </Pressable>

          <Pressable
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Entrando…' : 'Cadastrar'}</Text>
          </Pressable>
        </View>

        <Pressable onPress={handleForgotPassword} hitSlop={8}>
          <Text style={styles.forgotText}>I forgot my password</Text>
        </Pressable>

        <View style={styles.separator} />

        <Text style={styles.socialTitle}>registre-se com </Text>
        <View style={styles.socialRow}>
          <Pressable style={[styles.socialButton, styles.socialButtonLeft]} onPress={handleSocial}>
            <Text style={styles.socialButtonText}>Google</Text>
          </Pressable>
          <Pressable style={[styles.socialButton, styles.socialButtonRight]} onPress={handleSocial}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/login')} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={Brand.black} />
        </Pressable>
        <Text style={styles.backLabel}>VOLTAR PARA O LOGin do cliente</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.black,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 16,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.white,
  },
  checkboxActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  rememberText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Brand.black,
  },
  submitButton: {
    backgroundColor: Brand.black,
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  socialTitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#D69929',
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonLeft: {
    flex: 161,
  },
  socialButtonRight: {
    flex: 157,
  },
  socialButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.black,
    letterSpacing: 1.6,
  },
  bottomBar: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Brand.black,
  },
});