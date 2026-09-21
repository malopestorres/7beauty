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
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goToApp() {
    router.replace('/(tabs)');
  }

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
          // Usuário ainda não existe: o botão "Cadastrar" cria a conta.
          await createUserWithEmailAndPassword(auth, email.trim(), password);
        } else {
          throw error;
        }
      }
      goToApp();
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Quero achar salões</Text>
        </View>

        <View style={styles.form}>
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
            <Pressable style={styles.rememberRow} onPress={() => setRememberMe((v) => !v)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={16} color={Brand.black} />}
              </View>
              <Text style={styles.rememberText}>Lembre-me</Text>
            </Pressable>

            <Pressable
              style={[styles.registerButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.registerButtonText}>
                {isSubmitting ? 'Entrando…' : 'Cadastrar'}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={handleForgotPassword} hitSlop={8}>
            <Text style={styles.forgotText}>I forgot my password</Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.socialBlock}>
          <Text style={styles.socialTitle}>registre-se com </Text>
          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} onPress={handleSocial}>
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton} onPress={handleSocial}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.registerSalonRow} onPress={() => router.push('/register')}>
          <Text style={styles.registerSalonText}>Quero cadastrar meu salão</Text>
          <Ionicons name="arrow-forward" size={20} color={Brand.white} />
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  headingBlock: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.white,
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: Brand.white,
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 16,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
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
    borderColor: Brand.white,
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
    color: Brand.white,
  },
  registerButton: {
    backgroundColor: Brand.white,
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.black,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.white,
    alignSelf: 'center',
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#3A3A3A',
    marginVertical: 8,
  },
  socialBlock: {
    alignItems: 'center',
    gap: 16,
  },
  socialTitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.white,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#D69929',
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
    letterSpacing: 1.6,
  },
  registerSalonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  registerSalonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
  },
});