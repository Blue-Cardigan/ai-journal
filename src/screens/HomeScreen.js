import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Button, Card, Text, Icon } from 'react-native-elements';
import { supabase } from '../config/supabase';

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEntries();
    
    // Subscribe to changes
    const channel = supabase
      .channel('journal_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'journal_entries' }, 
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderEntry = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text style={styles.mood}>
          <Icon name="mood" type="material" size={20} /> {item.mood}
        </Text>
      </View>
      <Card.Divider />
      <Text style={styles.content}>{item.content}</Text>
    </Card>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="book" type="material" size={64} color="#A1CEDC" />
      <Text style={styles.emptyStateText}>No journal entries yet</Text>
      <Text style={styles.emptyStateSubText}>Start writing your thoughts!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="New Entry"
          icon={{
            name: 'edit',
            type: 'material',
            size: 20,
            color: 'white',
          }}
          onPress={() => navigation.navigate('JournalEntry')}
          containerStyle={styles.button}
          raised
        />
        <Button
          title="Chat with AI"
          icon={{
            name: 'psychology',
            type: 'material',
            size: 20,
            color: 'white',
          }}
          onPress={() => navigation.navigate('Chat')}
          containerStyle={styles.button}
          buttonStyle={{ backgroundColor: '#6200EE' }}
          raised
        />
      </View>
      
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={EmptyState}
        testID="flatlist"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#A1CEDC']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    width: '45%',
  },
  list: {
    padding: 8,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  mood: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
}); 