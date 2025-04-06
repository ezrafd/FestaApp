import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { mockUsers } from '../data/mockData.ts';
import { FestaCard } from '../components/FestaCard.tsx';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventContext.tsx';

export const FestasScreen = () => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const route = useRoute();
  const { events, addEvent, removeEvent, updateEvent } = useEvents();
  const [passedFestas, setPassedFestas] = useState<string[]>([]);
  const [joinedChats, setJoinedChats] = useState<string[]>([]);

  useEffect(() => {
    if (route.params?.sharedEvent) {
      const existingEvent = events.find(f => f.id === route.params.sharedEvent.id);
      if (!existingEvent) {
        addEvent(route.params.sharedEvent);
      }
    }

    const newEvent = route.params?.newEvent || route.params?.params?.newEvent;
    if (newEvent) {
      addEvent(newEvent);
    }
  }, [route.params]);

  const handlePass = (festaId: string) => {
    setPassedFestas(prev => [...prev, festaId]);
    removeEvent(festaId);
  };

  const handleShare = (festaId: string, friendIds: string[]) => {
    const sharedFesta = events.find(f => f.id === festaId);
    if (sharedFesta) {
      const existingSharedEvent = events.find(f => 
        f.id.startsWith(`${festaId}-shared-`) && 
        f.host.id === 'shared-event'
      );

      if (!existingSharedEvent) {
        const newSharedEvent = {
          ...sharedFesta,
          id: `${sharedFesta.id}-shared-${Date.now()}`,
          host: {
            id: 'shared-event',
            name: 'Shared Event',
            avatar: 'https://via.placeholder.com/150',
          },
          invitedFriends: friendIds,
          status: 'pending',
          image: sharedFesta.image,
        };
        addEvent(newSharedEvent);
      }
    }
  };

  const handleJoinChat = (festaId: string) => {
    const festa = events.find(f => f.id === festaId);
    if (!festa) return;

    if (festa.host.id === 'shared-event' && festa.invitedFriends?.includes('1')) {
      updateEvent(festaId, { status: 'accepted' });

      const chatGroup = {
        id: festaId,
        name: festa.title,
        participants: [
          ...mockUsers.filter(user => user.id === '1'),
          ...mockUsers.filter(user => user.id === festa.host.id),
        ],
        messages: [],
      };
      
      navigation.navigate('ChatDetail', { 
        chatId: festaId,
        chatGroup: chatGroup,
      });
    } else {
      const chatGroup = {
        id: festaId,
        name: festa.title,
        participants: [
          ...mockUsers.filter(user => user.id === '1'),
          ...mockUsers.filter(user => user.id === festa.host.id),
        ],
        messages: [],
      };
      
      navigation.navigate('ChatDetail', { 
        chatId: festaId,
        chatGroup: chatGroup,
      });
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, [navigation]);

  const renderHeader = () => (
    <TouchableOpacity
      style={[styles.createButton, { backgroundColor: colors.primary }]}
      onPress={() => navigation.navigate('CreateEvent')}
    >
      <Ionicons name="add" size={20} color="white" />
      <Text style={styles.createButtonText}>Create</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={events}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <FestaCard
            festa={item}
            onPass={() => handlePass(item.id)}
            onShare={handleShare}
            onJoinChat={handleJoinChat}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  createButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'Georgia',
    fontSize: 16,
  },
}); 