import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { mockFriends } from '../data/mockData.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { lightTheme, darkTheme } from '../theme/theme.ts';

interface CreateMeetupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (meetup: {
    title: string;
    description: string;
    dateTime?: string;
    selectedFriends: string[];
  }) => void;
}

export const CreateMeetupModal = ({
  visible,
  onClose,
  onCreate,
}: CreateMeetupModalProps) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleCreate = () => {
    onCreate({
      title,
      description,
      dateTime,
      selectedFriends,
    });
    setTitle('');
    setDescription('');
    setDateTime('');
    setSelectedFriends([]);
    onClose();
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.text }]}>Create Meetup</Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border 
            }]}
            placeholder="Title"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={[styles.input, styles.descriptionInput, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border 
            }]}
            placeholder="Description"
            placeholderTextColor={colors.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border 
            }]}
            placeholder="Date and Time (optional)"
            placeholderTextColor={colors.secondaryText}
            value={dateTime}
            onChangeText={setDateTime}
          />

          <Text style={[styles.friendsTitle, { color: colors.text }]}>Select Friends:</Text>
          <ScrollView style={styles.friendsList}>
            {mockFriends.map(friend => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendItem,
                  { 
                    backgroundColor: selectedFriends.includes(friend.id) 
                      ? colors.primary 
                      : colors.background,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => toggleFriend(friend.id)}
              >
                <Text style={[
                  styles.friendName,
                  { 
                    color: selectedFriends.includes(friend.id) 
                      ? 'white' 
                      : colors.text 
                  }
                ]}>
                  {friend.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.danger }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  friendsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  friendItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Georgia',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
}); 