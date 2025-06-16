import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Linking, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '../../components/ScreenContainer';

const HISTORY_KEY = 'user_history';

const saveSearch = async (query: string) => {
  const prev = await AsyncStorage.getItem(HISTORY_KEY);
  const history = prev ? JSON.parse(prev) : [];
  history.push({ type: 'search', value: query, timestamp: Date.now() });
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const saveClick = async (title: string, url: string) => {
  const prev = await AsyncStorage.getItem(HISTORY_KEY);
  const history = prev ? JSON.parse(prev) : [];
  history.push({ type: 'click', value: title, url, timestamp: Date.now() });
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export default function Profile() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);

    const options = {
      method: 'GET',
      url: 'https://real-time-amazon-data.p.rapidapi.com/search',
      params: { query: query, country: 'US', page: '1' },
      headers: {
        'x-rapidapi-key': '8b7ff90d02mshb4f209a50cc49e9p12b6bfjsn15efbf3404e6',
        'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
      }
    };

    try {
      interface ApiResponse {
        data: {
          products: Array<{
            product_title?: string;
            product_price?: string;
            currency?: string;
            reviews?: { rating?: string };
            total_reviews?: string;
            product_url: string;
            product_photo?: string;
          }>;
        };
      }

      const response = await axios.request<ApiResponse>(options);

      if (response.data && response.data.data && Array.isArray(response.data.data.products)) {
        setResults(response.data.data.products);
      } else {
        setResults([]);
      }
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => {
      Linking.openURL(item.product_url);
      saveClick(item.product_title || 'No Title Available', item.product_url);
    }} style={styles.card}>
      <View style={styles.imageWrapper}>
        {item.product_photo ? (
          <Image
            source={{ uri: item.product_photo }}
            style={styles.productImage}
            resizeMode="contain" // <-- ensures the whole image is visible
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.productTitle}>{item.product_title || 'No Title Available'}</Text>
        <Text style={styles.productPrice}>
          {item.product_price ? `Price: ${item.product_price} ${item.currency || ''}` : 'Price: N/A'}
        </Text>
        <Text style={styles.productRating}>
          {item.reviews?.rating ? `Rating: ${item.reviews.rating}` : 'No rating'}
        </Text>
        <Text style={styles.productReviews}>
          {item.total_reviews ? `${item.total_reviews} Reviews` : '0 Reviews'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#b9ffb7" />
        <Text style={styles.title}>🛒 Product Search</Text>
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#2e4d2c"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={searchProducts}
        />
        <TouchableOpacity onPress={searchProducts} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>{loading ? 'Searching...' : 'Search'}</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#2e4d2c" style={{ marginTop: 20 }} />}
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && (
              <Text style={styles.emptyText}>
                {query ? 'No products found.' : 'Start by searching for a product!'}
              </Text>
            )
          }
        />
      </SafeAreaView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaffd0', // lighter green
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a', // dark green/black
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2e4d2c', // dark green
    backgroundColor: '#fff',
    color: '#1a2e1a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1a2e1a', // dark green/black
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#2e4d2c',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchButtonText: {
    color: '#b9ffb7', // bright green text
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#b9ffb7', // subtle green border for card
    shadowColor: '#2e4d2c',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#b9ffb7',
    backgroundColor: '#eaffd0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#b9ffb7',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 6, // add a little padding so images don't touch the border
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // slightly less so the image fits better
    backgroundColor: '#fff', // optional: white background for better contrast
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaffd0',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    color: '#2e4d2c',
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#1a2e1a',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  productRating: {
    fontSize: 14,
    color: '#2e4d2c',
    marginBottom: 2,
  },
  productReviews: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    color: '#1a2e1a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});