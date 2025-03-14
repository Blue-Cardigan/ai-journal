import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { supabase } from '../config/supabase';

const MOODS = ['Great', 'Good', 'Okay', 'Bad', 'Awful'];

const JournalEntryScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content || !selectedMood) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase.from('journal_entries').insert([
        { content, mood: selectedMood, created_at: new Date().toISOString() }
      ]);

      if (error) throw error;
      navigation.goBack();
    } catch (err) {
      setError('Error saving entry. Please try again.');
      console.error('Error saving journal entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>How are you feeling today?</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood}
            testID={`mood-button-${mood}`}
            style={{
              padding: 10,
              margin: 5,
              borderRadius: 5,
              backgroundColor: selectedMood === mood ? '#e0e0e0' : 'transparent',
              borderWidth: 1,
              borderColor: '#ccc'
            }}
            onPress={() => setSelectedMood(mood)}
          >
            <Icon
              name={mood === 'Great' ? 'mood' : mood === 'Good' ? 'sentiment-satisfied' : 
                    mood === 'Okay' ? 'sentiment-neutral' : mood === 'Bad' ? 'sentiment-dissatisfied' : 'mood-bad'}
              type="material"
            />
            <Text>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        placeholder="Write your thoughts..."
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
        testID="journal-input"
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <Button
        title={isSaving ? 'Saving...' : 'Save Entry'}
        onPress={handleSave}
        disabled={!content || !selectedMood || isSaving}
        testID="save-button"
      />
    </ScrollView>
  );
};

export default JournalEntryScreen; 