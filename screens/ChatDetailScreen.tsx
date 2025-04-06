import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { mockUsers, mockChats } from '../data/mockData.ts';
import { Ionicons } from '@expo/vector-icons';

interface ChatDetailScreenProps {
  route: {
    params: {
      chatId: string;
      chatGroup?: {
        name: string;
        participants: any[];
        messages: any[];
      };
    };
  };
}

export const ChatDetailScreen = ({ route }: ChatDetailScreenProps) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const [message, setMessage] = useState('');
  const { chatId, chatGroup } = route.params;

  // Use chatGroup if provided, otherwise find chat from mockChats
  const chat = chatGroup || mockChats.find(chat => chat.id === chatId);

  if (!chat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Chat not found</Text>
      </SafeAreaView>
    );
  }

  const participants = chat.participants.map(participantId => {
    const user = mockUsers.find(user => user.id === participantId);
    return user?.name;
  }).filter(Boolean).join(', ');

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      const newMessage = {
        id: Date.now().toString(),
        senderId: '1', // Assuming current user is ID 1
        text: message.trim(),
        timestamp: new Date().toISOString(),
      };
      chat.messages.unshift(newMessage);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const sender = mockUsers.find((user: { id: string }) => user.id === item.senderId);
    const isCurrentUser = item.senderId === '1'; // Assuming current user is ID 1

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
          {!isCurrentUser && (
            <Text style={[styles.senderName, { color: colors.text }]}>
              {sender?.name}
            </Text>
          )}
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.chatName, { color: colors.text }]}>{chat.name}</Text>
        <Text style={[styles.participants, { color: colors.secondaryText }]}>
          {participants}
        </Text>
      </View>

      <FlatList
        data={chat.messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  chatName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  participants: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Georgia',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Georgia',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Georgia',
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
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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