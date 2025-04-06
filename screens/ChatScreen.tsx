import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App.tsx';
import { mockUsers } from '../data/mockData.ts';

type ChatScreenRouteProp = {
  params: {
    chatId: string;
    chatGroup: {
      id: string;
      name: string;
      participants: typeof mockUsers;
      messages: any[];
    };
  };
};

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export const ChatScreen = () => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const route = useRoute<ChatScreenRouteProp>();
  const { chatGroup } = route.params;
  const [messages, setMessages] = useState<Message[]>(chatGroup.messages || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: '1', // Current user's ID
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === '1';
    const sender = chatGroup.participants.find((p: typeof mockUsers[0]) => p.id === item.senderId);

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <Image source={{ uri: sender?.profilePic }} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isCurrentUser ? colors.primary : colors.cardBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isCurrentUser ? 'white' : colors.text },
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              { color: isCurrentUser ? 'rgba(255,255,255,0.7)' : colors.secondaryText },
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.background,
            },
          ]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'Georgia',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    fontFamily: 'Georgia',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 