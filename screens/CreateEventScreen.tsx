import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';
import { mockUsers } from '../data/mockData.ts';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventContext.tsx';

export const CreateEventScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const { addEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [maxAttendees, setMaxAttendees] = useState('20');

  const handleCreateEvent = () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title for your event');
      return;
    }

    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please invite at least one friend');
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title,
      description: description || 'No description provided',
      date: date || 'TBD',
      time: time || 'TBD',
      location: location || 'Location to be determined',
      image: selectedImage,
      host: {
        id: '1', // Current user's ID
        name: 'You',
        avatar: mockUsers[0].profilePic, // Use the first mock user's profile pic
      },
      attendees: 1,
      maxAttendees: parseInt(maxAttendees, 10) || 20,
      invitedFriends: selectedFriends,
    };

    addEvent(newEvent);
    navigation.goBack();
  };

  const handleSelectImage = () => {
    // For now, we'll just use a mock image
    setSelectedImage('https://images.unsplash.com/photo-1533219057257-4bb9ed5d2cc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="image-outline" size={50} color={colors.text} />
          </View>
        )}
        <TouchableOpacity 
          style={[styles.imageButton, { backgroundColor: colors.primary }]}
          onPress={handleSelectImage}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.imageButtonText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Event Title *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter event description"
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: colors.text }]}>Location (Optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter event location"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={[styles.label, { color: colors.text }]}>Date (Optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={[styles.label, { color: colors.text }]}>Time (Optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={[styles.label, { color: colors.text }]}>Max Attendees</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          value={maxAttendees}
          onChangeText={setMaxAttendees}
          placeholder="Enter max attendees"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: colors.text }]}>Invite Friends</Text>
        <FlatList
          data={mockUsers.filter(user => user.id !== '1')}
          renderItem={renderFriendItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          style={styles.friendsList}
          contentContainerStyle={styles.friendsListContent}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreateEvent}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  imageButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  form: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
  friendsList: {
    marginTop: 8,
  },
  friendsListContent: {
    paddingBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendText: {
    fontWeight: '500',
    fontFamily: 'Georgia',
  },
}); 