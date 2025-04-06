import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { mockUsers } from '../data/mockData.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';

interface ChatListItemProps {
  chat: {
    id: string;
    name: string;
    lastMessage: {
      senderId: string;
      text: string;
      timestamp: string;
    };
  };
  onPress: (chatId: string) => void;
}

export const ChatListItem = ({ chat, onPress }: ChatListItemProps) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const sender = mockUsers.find((user: { id: string }) => user.id === chat.lastMessage.senderId);

  return (
    <TouchableOpacity
      style={[styles.container, { 
        backgroundColor: colors.cardBackground,
        borderBottomColor: colors.border 
      }]}
      onPress={() => onPress(chat.id)}
    >
      <Image
        source={{ uri: sender?.profilePic }}
        style={styles.avatar}
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{chat.name}</Text>
          <Text style={[styles.time, { color: colors.secondaryText }]}>
            {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <Text style={[styles.lastMessage, { color: colors.secondaryText }]} numberOfLines={1}>
          {`${sender?.name}: ${chat.lastMessage.text}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
}); 