import { FirebaseError } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Entra com email/senha. Se a conta ainda não existir, cria e entra —
 * o comportamento do botão "Cadastrar" do design.
 *
 * Atenção: desde o Firebase v10.12, "conta inexistente" e "senha errada"
 * retornam o MESMO código (`auth/invalid-credential`). Por isso tentamos
 * criar a conta nesses dois casos: se o email já existir, o create falha
 * com `auth/email-already-in-use` e a tela mostra "senha incorreta".
 */
export async function signInOrCreate(
  auth: Auth,
  email: string,
  password: string,
) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const code = (error as FirebaseError).code;
    if (code !== 'auth/user-not-found' && code !== 'auth/invalid-credential') {
      throw error;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }
}