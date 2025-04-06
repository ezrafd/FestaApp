import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { Ionicons } from '@expo/vector-icons';
import { Festa } from '../data/mockData.ts';
import { useNavigation } from '@react-navigation/native';
import { mockUsers } from '../data/mockData.ts';

interface FestaCardProps {
  festa: Festa;
  onPass: () => void;
  onShare?: (festaId: string, friendIds: string[]) => void;
  onJoinChat?: (festaId: string) => void;
}

export const FestaCard: React.FC<FestaCardProps> = ({ festa, onPass, onShare, onJoinChat }) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const [isJoined, setIsJoined] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleJoin = () => {
    setIsJoined(true);
    if (onJoinChat) {
      onJoinChat(festa.id);
    }
  };

  const handlePass = () => {
    onPass();
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleJoinChat = () => {
    if (onJoinChat) {
      onJoinChat(festa.id);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleShareConfirm = () => {
    if (onShare && selectedFriends.length > 0) {
      onShare(festa.id, selectedFriends);
    }
    setShowShareModal(false);
    setSelectedFriends([]);
  };

  const renderFriendItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <TouchableOpacity
      style={[
        styles.friendItem,
        { 
          backgroundColor: selectedFriends.includes(item.id) 
            ? colors.primary 
            : colors.cardBackground 
        }
      ]}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <Image source={{ uri: item.profilePic }} style={styles.friendAvatar} />
      <Text style={[
        styles.friendText,
        { color: selectedFriends.includes(item.id) ? '#fff' : colors.text }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {festa.image ? (
        <Image source={{ uri: festa.image }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.background }]}>
          <Ionicons name="calendar" size={40} color={colors.text} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{festa.title}</Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>{festa.description}</Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.secondaryText} />
            <Text style={[styles.detailText, { color: colors.secondaryText }]}>
              {festa.date} at {festa.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.secondaryText} />
            <Text style={[styles.detailText, { color: colors.secondaryText }]}>{festa.location}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.hostInfo}>
            <Image source={{ uri: festa.host.avatar }} style={styles.avatar} />
            <Text style={[styles.hostName, { color: colors.text }]}>{festa.host.name}</Text>
          </View>
          <View style={styles.attendees}>
            <Ionicons name="people" size={16} color={colors.secondaryText} />
            <Text style={[styles.attendeesText, { color: colors.secondaryText }]}>
              {festa.attendees}/{festa.maxAttendees}
            </Text>
          </View>
        </View>
        {!isJoined ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.passButton]}
              onPress={handlePass}
            >
              <Text style={styles.buttonText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={handleJoin}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleJoinChat}
            >
              <Text style={styles.buttonText}>Join Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2196F3' }]}
              onPress={handleShare}
            >
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showShareModal && (
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Share with Friends</Text>
          <FlatList
            data={mockUsers.filter(user => user.id !== '1')}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id}
            style={styles.friendsList}
            contentContainerStyle={styles.friendsListContent}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.cardBackground }]}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleShareConfirm}
            >
              <Text style={styles.modalButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  hostName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Georgia',
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  friendsList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  friendsListContent: {
    gap: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  friendText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Georgia',
  },
}); 