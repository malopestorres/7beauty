import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = '@7beauty/remember-me';

/** Grava a preferência do "Lembre-me" (sessão local mantida ao fechar o app). */
export async function setRememberMe(enabled: boolean) {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, enabled ? 'true' : 'false');
}

/** Lê a preferência; por padrão a sessão é lembrada. */
export async function isRemembered() {
  const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
  return value !== 'false';
}