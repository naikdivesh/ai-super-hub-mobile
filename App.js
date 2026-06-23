import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
// TouchableOpacity = a tappable wrapper (like a button); it dims slightly when pressed.
import { StyleSheet, Text, View, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';

const TOOLS = [
  { id: '1', name: 'ChatGPT', description: 'Conversational AI assistant by OpenAI', category: 'Chatbot' },
  { id: '2', name: 'Midjourney', description: 'AI image generation from text prompts', category: 'Image Generation' },
  { id: '3', name: 'GitHub Copilot', description: 'AI pair programmer for writing code', category: 'Coding' },
  { id: '4', name: 'Gemini', description: "Google's multimodal AI model", category: 'Chatbot' },
  { id: '5', name: 'ElevenLabs', description: 'AI voice generation and cloning', category: 'Audio' },
  { id: '6', name: 'Perplexity', description: 'AI-powered answer engine with sources', category: 'Search' },
];

// The card is now tappable and shows whether it's bookmarked.
// It receives: the tool, whether it's bookmarked, and a function to call on tap.
function ToolCard({ tool, isBookmarked, onToggle }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.cardTop}>
        <Text style={styles.cardName}>{tool.name}</Text>
        {/* A filled star if bookmarked, outline if not */}
        <Text style={styles.star}>{isBookmarked ? '★' : '☆'}</Text>
      </View>
      <Text style={styles.cardDesc}>{tool.description}</Text>
      <Text style={styles.cardCategory}>Category: {tool.category}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  // 1. Bookmarks state: an array of tool ids that are favorited. Starts empty.
  const [bookmarks, setBookmarks] = useState([]);

  // 2. Toggle function: add the id if missing, remove it if present.
  //    KEY IDEA: we never modify the old array. We build a NEW one.
  const toggleBookmark = (id) => {
    setBookmarks((current) => {
      if (current.includes(id)) {
        // remove: filter returns a NEW array without this id
        return current.filter((b) => b !== id);
      } else {
        // add: spread the old array into a new one, then add the id
        return [...current, id];
      }
    });
  };

  const filteredTools = TOOLS.filter((tool) => {
    const query = search.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Super Hub</Text>
        {/* 3. Show a live bookmark count, driven by state */}
        <Text style={styles.subtitle}>
          Tools Directory · {bookmarks.length} bookmarked
        </Text>
      </View>

      <TextInput
        style={styles.searchBox}
        placeholder="Search tools or categories..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
      />

      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ToolCard
            tool={item}
            isBookmarked={bookmarks.includes(item.id)}
            onToggle={() => toggleBookmark(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No tools match "{search}"</Text>}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 16 },
  header: { paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 16, color: '#94a3b8', marginTop: 4 },
  searchBox: {
    backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 12, color: '#ffffff', fontSize: 16, marginBottom: 16,
  },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 18, fontWeight: '600', color: '#ffffff', flex: 1 },
  star: { fontSize: 22, color: '#fbbf24', marginLeft: 8 },
  cardDesc: { fontSize: 14, color: '#cbd5e1', marginTop: 4 },
  cardCategory: { fontSize: 12, color: '#60a5fa', marginTop: 8 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
