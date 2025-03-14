import React, { useState, useEffect } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { supabase } from '../config/supabase';
import { getGeminiResponse } from '../lib/gemini';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatContext, setChatContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (entries && entries.length > 0) {
        const context = entries.map(entry => 
          `Entry from ${new Date(entry.created_at).toLocaleDateString()}: ${entry.content}`
        ).join('\n\n');
        
        setChatContext(context);
        setMessages([{
          text: `I've read your ${entries.length} recent entries. How can I help you reflect on them?`,
          isUser: false
        }]);
      } else {
        setChatContext('No journal entries found.');
        setMessages([{
          text: "Hi! I don't see any journal entries yet. Feel free to create some entries, and I'll be here to discuss them with you!",
          isUser: false
        }]);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
      setMessages([{
        text: "Sorry, I encountered an error loading your journal entries. Please try again later.",
        isUser: false
      }]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      text: newMessage,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const prompt = `Context: ${chatContext}\n\nUser: ${newMessage}\n\nAssistant: Please provide a thoughtful and empathetic response based on the journal entries.`;
      const response = await getGeminiResponse(prompt);

      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error processing your message. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={{
      alignSelf: item.isUser ? 'flex-end' : 'flex-start',
      backgroundColor: item.isUser ? '#007AFF' : '#E5E5EA',
      padding: 10,
      margin: 5,
      borderRadius: 10,
      maxWidth: '80%'
    }}>
      <Text style={{ color: item.isUser ? 'white' : 'black' }}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
      />

      {isLoading && (
        <Text style={{ textAlign: 'center', padding: 10 }}>Thinking...</Text>
      )}

      <View style={{ padding: 10, borderTopWidth: 1, borderColor: '#ccc' }}>
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          testID="chat-input"
        />
        <Button
          title="Send"
          onPress={handleSend}
          disabled={!newMessage.trim() || isLoading}
          testID="send-button"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen; 