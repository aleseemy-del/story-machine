import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { tellStory } from './storyApi';

const COLORS = {
  sand: '#F5E9D3',
  card: '#FFF7E8',
  brown: '#4A2C17',
  softBrown: '#8A6A4F',
  fire: '#D9561E',
  border: '#E0CBA6',
};

export default function App() {
  const [spark, setSpark] = useState('');
  const [story, setStory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const canTell = spark.trim().length > 0 && !loading;

  async function onTell() {
    if (!canTell) return;
    setLoading(true);
    setError(null);
    setStory('');
    try {
      setStory(await tellStory(spark.trim()));
    } catch (e) {
      setError({
        message: e?.message || 'صار شي غير متوقع.',
        code: e?.code || 'unknown',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>حكايات البر</Text>
        <Text style={styles.subtitle}>اكتب شرارة، شخصية أو مكان أو موقف في البر</Text>

        <TextInput
          style={styles.input}
          value={spark}
          onChangeText={setSpark}
          placeholder="مثلاً: رجال ضيّع دربه بالليل"
          placeholderTextColor={COLORS.softBrown}
          multiline
          textAlign="right"
        />

        <Pressable
          style={[styles.button, !canTell && styles.buttonDisabled]}
          onPress={onTell}
          disabled={!canTell}
        >
          <Text style={styles.buttonText}>احكِ لي</Text>
        </Pressable>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.fire} />
            <Text style={styles.loadingText}>جارٍ تأجيج النار وحكي الحكاية…</Text>
          </View>
        )}

        {error && (
          <View style={styles.card}>
            <Text style={styles.errorText}>{error.message} جرّب مرة ثانية.</Text>
            <Pressable style={styles.retry} onPress={onTell}>
              <Text style={styles.retryText}>حاول مجدداً</Text>
            </Pressable>
            <Text style={styles.code}>رمز الحالة: {error.code}</Text>
          </View>
        )}

        {story !== '' && (
          <View style={styles.card}>
            <Text style={styles.story}>{story}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.sand },
  content: { padding: 20, paddingTop: 70, paddingBottom: 60, direction: 'rtl' },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.fire,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.softBrown,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
    writingDirection: 'rtl',
  },
  input: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    minHeight: 100,
    fontSize: 20,
    color: COLORS.brown,
    textAlignVertical: 'top',
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: COLORS.fire,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  center: { alignItems: 'center', marginTop: 28 },
  loadingText: {
    fontSize: 18,
    color: COLORS.brown,
    marginTop: 12,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
  },
  story: {
    fontSize: 21,
    lineHeight: 36,
    color: COLORS.brown,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  errorText: {
    fontSize: 19,
    color: COLORS.brown,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  retry: {
    backgroundColor: COLORS.brown,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  retryText: { color: COLORS.sand, fontSize: 18, fontWeight: '700' },
  code: { fontSize: 12, color: COLORS.softBrown, marginTop: 10, textAlign: 'right' },
});
