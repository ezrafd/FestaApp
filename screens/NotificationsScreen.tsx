import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { Ionicons } from '@expo/vector-icons';
import { mockNotifications, mockUsers, mockMeetups, NotificationType } from '../data/mockData.ts';

const getNotificationMessage = (type: NotificationType, userName: string, eventTitle: string) => {
  switch (type) {
    case 'friend_joined_event':
      return `${userName} joined your event "${eventTitle}"`;
    case 'new_event_invite':
      return `${userName} invited you to "${eventTitle}"`;
    case 'stranger_joined_event':
      return `${userName} joined "${eventTitle}"`;
    case 'friend_shared_event':
      return `${userName} shared "${eventTitle}" with you`;
    default:
      return '';
  }
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'friend_joined_event':
      return 'person-add';
    case 'new_event_invite':
      return 'calendar';
    case 'stranger_joined_event':
      return 'person';
    case 'friend_shared_event':
      return 'share';
    default:
      return 'notifications';
  }
};

export const NotificationsScreen = () => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const renderNotificationItem = ({ item }: { item: typeof mockNotifications[0] }) => {
    const user = mockUsers.find(u => u.id === item.userId);
    const event = mockMeetups.find(e => e.id === item.eventId);
    const message = getNotificationMessage(item.type, user?.name || '', event?.title || '');
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { 
            backgroundColor: item.read ? colors.cardBackground : colors.primary + '20',
            borderLeftColor: colors.primary,
          }
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationHeader}>
          <Image
            source={{ uri: user?.profilePic }}
            style={styles.avatar}
          />
          <View style={styles.notificationInfo}>
            <Text style={[styles.message, { color: colors.text }]}>
              {message}
            </Text>
            <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
          <Ionicons
            name={icon as any}
            size={24}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Georgia',
  },
}); 