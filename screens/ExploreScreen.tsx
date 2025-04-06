import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ListRenderItem,
  Modal,
} from 'react-native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { Ionicons } from '@expo/vector-icons';
import { mockUsers } from '../data/mockData.ts';
import { mockFestas } from '../data/mockData.ts';
import { useNavigation } from '@react-navigation/native';
import { FestaCard } from '../components/FestaCard.tsx';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  price: string;
  image: string;
};

type Venue = {
  id: string;
  name: string;
  type: string;
  image: string;
  events: Event[];
};

type User = typeof mockUsers[0];

type ExploreItem = Venue | User;

// Mock data for venues and their events
const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'The Blue Club',
    type: 'Nightclub',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    events: [
      {
        id: '1',
        title: 'Summer Night Party',
        date: '2024-06-15',
        time: '22:00',
        description: 'Join us for the hottest summer party!',
        price: '$20',
        image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      }
    ]
  },
  {
    id: '2',
    name: 'Café Luna',
    type: 'Café',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1947&q=80',
    events: [
      {
        id: '2',
        title: 'Coffee Tasting Workshop',
        date: '2024-06-20',
        time: '15:00',
        description: 'Learn about different coffee varieties and brewing methods',
        price: '$15',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      }
    ]
  },
  {
    id: '3',
    name: 'Urban Threads',
    type: 'Clothing Store',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    events: [
      {
        id: '3',
        title: 'Summer Collection Launch',
        date: '2024-06-25',
        time: '18:00',
        description: 'Be the first to see our new summer collection',
        price: 'Free',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      }
    ]
  }
];

export const ExploreScreen = () => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'venues' | 'people'>('venues');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const filteredVenues = mockVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user => 
    user.id !== '1' && // Filter out current user
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleShare = (festaId: string) => {
    setSelectedEvent(festaId);
    setShareModalVisible(true);
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleShareConfirm = () => {
    if (selectedEvent && selectedFriends.length > 0) {
      const festa = mockFestas.find(f => f.id === selectedEvent);
      if (festa) {
        // In a real app, this would update the backend
        // For now, we'll just navigate to the Festas screen with the shared event
        navigation.navigate('Festas', {
          sharedEvent: {
            ...festa,
            id: `${festa.id}-shared-${Date.now()}`,
            host: {
              id: 'shared-event',
              name: 'Shared Event',
              avatar: 'https://via.placeholder.com/150',
            },
            invitedFriends: selectedFriends,
            status: 'pending',
            image: festa.image,
          },
        });
      }
    }
    setShareModalVisible(false);
    setSelectedFriends([]);
    setSelectedEvent(null);
  };

  const renderEventCard = useCallback(({ item: event, venueId }: { item: Event, venueId: string }) => {
    return (
      <View style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
          <Text style={[styles.eventDetails, { color: colors.secondaryText }]}>
            {event.date} at {event.time}
          </Text>
          <Text style={[styles.eventPrice, { color: colors.primary }]}>{event.price}</Text>
          <Text style={[styles.eventDescription, { color: colors.text }]} numberOfLines={2}>
            {event.description}
          </Text>
        </View>
      </View>
    );
  }, [colors]);

  const renderVenueCard = useCallback(({ item: venue }: { item: Venue }) => {
    return (
      <View style={[styles.venueCard, { backgroundColor: colors.cardBackground }]}>
        <Image source={{ uri: venue.image }} style={styles.venueImage} />
        <View style={styles.venueInfo}>
          <Text style={[styles.venueName, { color: colors.text }]}>{venue.name}</Text>
          <Text style={[styles.venueType, { color: colors.secondaryText }]}>{venue.type}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
          {venue.events.map(event => (
            <View key={event.id} style={styles.eventContainer}>
              {renderEventCard({ item: event, venueId: venue.id })}
              <TouchableOpacity
                style={[styles.shareButton, { backgroundColor: colors.primary }]}
                onPress={() => handleShare(event.id)}
              >
                <Text style={styles.shareButtonText}>Share with Friends</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }, [colors, handleShare, renderEventCard]);

  const renderUserItem = useCallback(({ item }: { item: User }) => {
    return (
      <View style={[styles.userCard, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.profilePic }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.username, { color: colors.secondaryText }]}>@{item.username}</Text>
            {item.bio && (
              <Text style={[styles.bio, { color: colors.text }]} numberOfLines={2}>
                {item.bio}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
    );
  }, [colors]);

  const renderItem: ListRenderItem<ExploreItem> = useCallback(({ item }) => {
    if ('events' in item) {
      return renderVenueCard({ item });
    } else {
      return renderUserItem({ item });
    }
  }, [renderVenueCard, renderUserItem]);

  const renderFriendItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[
        styles.friendItem,
        { backgroundColor: colors.cardBackground },
        selectedFriends.includes(item.id) && styles.selectedFriend,
      ]}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.friendName, { color: colors.text }]}>{item.name}</Text>
      </View>
      {selectedFriends.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="search" size={20} color={colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={`Search ${selectedTab === 'venues' ? 'venues and events' : 'people'}`}
          placeholderTextColor={colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'venues' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedTab('venues')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'venues' ? 'white' : colors.text }
            ]}
          >
            Venues & Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'people' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedTab('people')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'people' ? 'white' : colors.text }
            ]}
          >
            People
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={selectedTab === 'venues' ? filteredVenues : filteredUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={shareModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Share with Friends</Text>
            <FlatList
              data={mockUsers.filter(user => user.id !== '1')} // Filter out current user
              renderItem={renderFriendItem}
              keyExtractor={item => item.id}
              style={styles.friendsList}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShareModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.shareButton,
                  { backgroundColor: colors.primary },
                  selectedFriends.length === 0 && styles.disabledButton,
                ]}
                onPress={handleShareConfirm}
                disabled={selectedFriends.length === 0}
              >
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
    fontFamily: 'Georgia',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  venueCard: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: 150,
  },
  venueInfo: {
    padding: 12,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  venueType: {
    fontSize: 14,
    fontFamily: 'Georgia',
  },
  eventsScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  eventContainer: {
    width: 280,
    marginRight: 12,
  },
  eventCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  eventDetails: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  eventDescription: {
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'Georgia',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Georgia',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Georgia',
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  bio: {
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'Georgia',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 16,
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
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFriend: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 