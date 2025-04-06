import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { mockChats, mockUsers } from '../data/mockData.ts';
import { useNavigation } from '@react-navigation/native';

export const ChatsScreen = () => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();

  const handleChatPress = (chatId: string) => {
    navigation.navigate('ChatDetail', { chatId });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const participants = item.participants.map((participantId: string) => {
      const user = mockUsers.find(user => user.id === participantId);
      return user?.name;
    }).filter(Boolean).join(', ');

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: colors.cardBackground }]}
        onPress={() => handleChatPress(item.id)}
      >
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.participants, { color: colors.secondaryText }]}>
            {participants}
          </Text>
          <Text style={[styles.lastMessage, { color: colors.secondaryText }]}>
            {item.messages[item.messages.length - 1].text}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
          {new Date(item.messages[item.messages.length - 1].timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>
      </View>
      <FlatList
        data={mockChats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  participants: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Georgia',
  },
}); 