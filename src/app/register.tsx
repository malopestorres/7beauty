import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand, Typography } from '@/constants/theme';
import { auth, db } from '@/lib/firebase';

const MAX_DESCRIPTION = 280;

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'salon';
}

export default function RegisterSalonScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [openDays, setOpenDays] = useState('Seg - Sex');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeDays, setCloseDays] = useState('Sáb - Dom');
  const [closeTime, setCloseTime] = useState('19:00');
  const [servesBrazilians, setServesBrazilians] = useState(true);
  const [servesPortuguese, setServesPortuguese] = useState(false);
  const [description, setDescription] = useState('');
  const [profName, setProfName] = useState('');
  const [professionals, setProfessionals] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function addProfessional() {
    const value = profName.trim();
    if (!value) {
      return;
    }
    setProfessionals((current) => [...current, value]);
    setProfName('');
  }

  function addProduct() {
    setProducts((current) => [
      ...current,
      `https://picsum.photos/seed/produto-${Date.now().toString().slice(-5)}/400/400`,
    ]);
  }

  async function handleSave() {
    if (!name.trim() || !address.trim() || !city.trim() || !state.trim()) {
      Alert.alert('Atenção', 'Preencha pelo menos nome, endereço, cidade e estado.');
      return;
    }
    if (!auth.currentUser) {
      Alert.alert('Entre primeiro', 'Faça login para poder cadastrar um salão.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Entrar', onPress: () => router.push('/login-salon') },
      ]);
      return;
    }

    setIsSaving(true);
    try {
      const seed = slugify(name);
      await setDoc(doc(collection(db, 'salons')), {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase() || 'SP',
        phone: phone.trim() || whatsapp.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        description: description.trim(),
        openingHours: `${openDays.trim()} ${openTime.trim()} - ${closeDays.trim()} ${closeTime.trim()}`,
        services: [],
        professionals: professionals.map((professional) => ({
          name: professional,
          photoUrl: '',
        })),
        products,
        audience: [
          servesBrazilians ? 'Brasileiros' : null,
          servesPortuguese ? 'Portugueses' : null,
        ].filter(Boolean),
        imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
        coverUrl: `https://picsum.photos/seed/${seed}-capa/900/450`,
        rating: 0,
        reviewsCount: 0,
        priceFrom: 0,
        priceTo: 0,
        isOpen: true,
        tags: [],
        createdAt: serverTimestamp(),
      });
      Alert.alert('Salão cadastrado!', 'Seu salão já aparece na lista.', [
        { text: 'Ver lista', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o salão. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  const audienceRow = [
    { key: 'br', label: 'Brasileiros', flag: '🇧🇷', active: servesBrazilians, set: setServesBrazilians },
    { key: 'pt', label: 'Portugueses', flag: '🇵🇹', active: servesPortuguese, set: setServesPortuguese },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={Brand.black} />
          </Pressable>
          <Text style={styles.headerTitle}>Cadastro completo</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Dados Principais</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#6B6B6B"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço"
            placeholderTextColor="#6B6B6B"
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="Cidade"
              placeholderTextColor="#6B6B6B"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="UF"
              placeholderTextColor="#6B6B6B"
              value={state}
              onChangeText={setState}
              maxLength={2}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.pair}>
              <TextStyle label="Data" />
              <TextInput
                style={styles.input}
                placeholder="Dias abertura"
                placeholderTextColor="#6B6B6B"
                value={openDays}
                onChangeText={setOpenDays}
              />
            </View>
            <View style={styles.pair}>
              <TextStyle label="Abertura" />
              <TextInput
                style={styles.input}
                placeholder="09:00"
                placeholderTextColor="#6B6B6B"
                value={openTime}
                onChangeText={setOpenTime}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.pair}>
              <TextStyle label="Data" />
              <TextInput
                style={styles.input}
                placeholder="Dias fechamento"
                placeholderTextColor="#6B6B6B"
                value={closeDays}
                onChangeText={setCloseDays}
              />
            </View>
            <View style={styles.pair}>
              <TextStyle label="Fechamento" />
              <TextInput
                style={styles.input}
                placeholder="19:00"
                placeholderTextColor="#6B6B6B"
                value={closeTime}
                onChangeText={setCloseTime}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Atendo: Brasileiros / Portugueses</Text>
          <View style={styles.audienceRow}>
            {audienceRow.map((item) => (
              <Pressable
                key={item.key}
                style={styles.audienceChip}
                onPress={() => item.set(!item.active)}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={[styles.checkbox, item.active && styles.checkboxActive]}>
                  {item.active && <Ionicons name="checkmark" size={12} color={Brand.white} />}
                </View>
                <Text style={styles.audienceLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Digite aqui sua descrição..."
            placeholderTextColor="#6B6B6B"
            value={description}
            onChangeText={(value) => setDescription(value.slice(0, MAX_DESCRIPTION))}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.counter}>
            {description.length}/{MAX_DESCRIPTION} caracteres
          </Text>

          <Text style={styles.sectionLabel}>Profissionais</Text>
          <View style={styles.professionalAddRow}>
            <TextInput
              style={[styles.input, styles.professionalInput]}
              placeholder="Nome do Profissional"
              placeholderTextColor="#6B6B6B"
              value={profName}
              onChangeText={setProfName}
              onSubmitEditing={addProfessional}
            />
            <Pressable style={styles.addButton} onPress={addProfessional}>
              <Ionicons name="add" size={20} color={Brand.white} />
            </Pressable>
          </View>
          {professionals.length > 0 ? (
            <View style={styles.chips}>
              {professionals.map((professional) => (
                <Pressable
                  key={professional}
                  style={styles.chip}
                  onPress={() =>
                    setProfessionals((current) => current.filter((item) => item !== professional))
                  }
                >
                  <View style={styles.chipAvatar}>
                    <Text style={styles.chipInitial}>{professional.charAt(0)}</Text>
                  </View>
                  <Text style={styles.chipLabel} numberOfLines={1}>
                    {professional}
                  </Text>
                  <Ionicons name="close" size={14} color="#6B6B6B" />
                </Pressable>
              ))}
            </View>
          ) : null}
          <Text style={styles.addMore}>Adicionar mais profissionais</Text>

          <Text style={styles.sectionLabel}>Produtos</Text>
          <View style={styles.productsGrid}>
            {products.map((product, index) => (
              <Pressable key={`${product}-${index}`} onPress={() => undefined}>
                <ImageTile url={product} onRemove={() => setProducts((current) => current.filter((_, i) => i !== index))} />
              </Pressable>
            ))}
            {products.length < 6 ? (
              <Pressable style={styles.productAdd} onPress={addProduct}>
                <Ionicons name="add" size={30} color="#6B6B6B" />
              </Pressable>
            ) : null}
          </View>

          <Text style={styles.sectionLabel}>Contatos</Text>
          <TextInput
            style={styles.input}
            placeholder="DDD + Telefone"
            placeholderTextColor="#6B6B6B"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Whatsapp"
            placeholderTextColor="#6B6B6B"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6B6B6B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable style={styles.loginSalonLink} onPress={() => router.push('/login-salon')}>
            <Text style={styles.loginSalonText}>Já tem conta de salão? Entrar</Text>
          </Pressable>

          <Pressable
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{isSaving ? 'Salvando…' : 'Salvar'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TextStyle({ label }: { label: string }) {
  return <Text style={styles.fieldLabel}>{label}</Text>;
}

function ImageTile({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (
    <View>
      <SalonProduct url={url} />
      <Pressable style={styles.productRemove} onPress={onRemove} hitSlop={6}>
        <Ionicons name="close" size={12} color={Brand.white} />
      </Pressable>
    </View>
  );
}

function SalonProduct({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.productImage} contentFit="cover" transition={200} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  header: {
    height: 77,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  headerTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Brand.black,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
    marginTop: 28,
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 6,
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
  textArea: {
    height: 184,
    paddingTop: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
  pair: {
    flex: 1,
  },
  audienceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  audienceChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
  },
  flag: {
    fontSize: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  audienceLabel: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Brand.black,
  },
  counter: {
    fontFamily: Typography.body,
    fontSize: 10,
    color: '#B0B0B0',
    marginTop: -4,
    marginBottom: 8,
    textAlign: 'right',
  },
  professionalAddRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  professionalInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Brand.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingRight: 10,
    paddingVertical: 4,
    maxWidth: 180,
  },
  chipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInitial: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Brand.white,
  },
  chipLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Brand.black,
    flexShrink: 1,
  },
  addMore: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'right',
    marginTop: 10,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productImage: {
    width: 104,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#F0F0F3',
  },
  productAdd: {
    width: 104,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#F0F0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginSalonLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginSalonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Brand.black,
    textDecorationLine: 'underline',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: Brand.black,
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Brand.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});