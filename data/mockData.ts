// Mock Users
export const mockUsers = [
  {
    id: '1',
    username: 'johndoe',
    name: 'John Doe',
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Software developer and coffee enthusiast',
  },
  {
    id: '2',
    username: 'sarahsmith',
    name: 'Sarah Smith',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Digital nomad and travel lover',
  },
  {
    id: '3',
    username: 'mikechen',
    name: 'Mike Chen',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Photographer and adventure seeker',
  },
  {
    id: '4',
    username: 'emilywilson',
    name: 'Emily Wilson',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Foodie and event organizer',
  },
];

// Mock Friends (for current user)
export const mockFriends = [
  {
    id: '2',
    name: 'Sarah Smith',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Mike Chen',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Emily Wilson',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

export interface Festa {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  host: {
    id: string;
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees: number;
  invitedFriends?: string[];
  status?: 'pending' | 'accepted';
}

export const mockFestas = [
  {
    id: '1',
    title: 'Beach Party',
    description: 'Join us for a fun day at the beach with music, games, and BBQ!',
    date: '2024-07-15',
    time: '14:00',
    location: 'Santa Monica Beach',
    image: 'https://images.unsplash.com/photo-1533219057257-4bb9ed5d2cc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    host: {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    attendees: 12,
    maxAttendees: 20
  },
  {
    id: '2',
    title: 'Game Night',
    description: 'Board games, video games, and pizza! All are welcome.',
    date: '2024-07-20',
    time: '19:00',
    location: '123 Game Street',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FtZSUyMG5pZ2h0fGVufDB8fDB8fHww',
    host: {
      id: '3',
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    attendees: 8,
    maxAttendees: 15
  },
  {
    id: '3',
    title: 'Hiking Adventure',
    description: 'Let\'s explore the beautiful trails of Griffith Park!',
    date: '2024-07-25',
    time: '09:00',
    location: 'Griffith Park',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fHww',
    host: {
      id: '4',
      name: 'Emily Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    attendees: 5,
    maxAttendees: 10
  }
] as Festa[];

// Mock Chats
export const mockChats = [
  {
    id: '1',
    name: 'Beach Party Chat',
    participants: ['1', '2', '3'],
    messages: [
      {
        id: '1',
        senderId: '2',
        text: 'Hey everyone! Looking forward to the beach party!',
        timestamp: '2024-07-10T10:00:00Z',
      },
      {
        id: '2',
        senderId: '1',
        text: 'Me too! What should I bring?',
        timestamp: '2024-07-10T10:05:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Game Night Chat',
    participants: ['1', '3', '4'],
    messages: [
      {
        id: '1',
        senderId: '3',
        text: 'Who\'s bringing the board games?',
        timestamp: '2024-07-15T15:00:00Z',
      },
    ],
  },
];

export type NotificationType = 
  | 'friend_request'
  | 'event_invite'
  | 'friend_joined_festa'
  | 'new_festa_invite'
  | 'stranger_joined_festa'
  | 'friend_shared_festa';

export interface Notification {
  id: string;
  type: NotificationType;
  from: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications = [
  {
    id: '1',
    type: 'friend_request',
    from: '2',
    message: 'Sarah Smith sent you a friend request',
    timestamp: '2024-07-01T10:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'event_invite',
    from: '3',
    message: 'Mike Chen invited you to Game Night',
    timestamp: '2024-07-05T15:30:00Z',
    read: true,
  },
]; 