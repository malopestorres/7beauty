import { FirebaseError } from 'firebase/app';

export function getAuthErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Informe um email válido.';
    case 'auth/user-not-found':
      return 'Conta não encontrada. Cadastre-se para continuar.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este email já está cadastrado. Entre com a senha.';
    case 'auth/weak-password':
      return 'Senha fraca: use pelo menos 6 caracteres.';
    case 'auth/invalid-credential':
      return 'Email ou senha inválidos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns instantes e tente de novo.';
    default:
      return 'Não foi possível entrar. Tente novamente.';
  }
}