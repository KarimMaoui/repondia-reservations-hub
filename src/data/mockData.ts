// Mock data for Repondia restaurant reservation app

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
  source: 'call' | 'sms' | 'whatsapp';
  createdAt: string;
}

export interface Message {
  id: string;
  reservationId: string;
  customerName: string;
  customerPhone: string;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'customer' | 'restaurant';
  timestamp: string;
  read: boolean;
}

export interface CallLog {
  id: string;
  customerName?: string;
  customerPhone: string;
  duration: number; // in seconds
  type: 'missed' | 'received' | 'outgoing';
  timestamp: string;
  hasVoicemail: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  openingHours: string;
  averageCapacity: number;
}

// Mock Restaurant
export const restaurant: Restaurant = {
  id: 'rest-001',
  name: 'Le Petit Bistro',
  address: '42 Rue de la Paix, Paris 75002',
  phone: '+33 1 42 86 87 88',
  email: 'contact@lepetitbistro.fr',
  openingHours: '12:00 - 23:00',
  averageCapacity: 45,
};

// Mock Reservations
export const reservations: Reservation[] = [
  {
    id: 'res-001',
    customerName: 'Marie Dupont',
    customerPhone: '+33 6 12 34 56 78',
    date: '2024-12-20',
    time: '19:30',
    guests: 4,
    status: 'pending',
    notes: 'Anniversary dinner, window seat preferred',
    source: 'whatsapp',
    createdAt: '2024-12-19T14:30:00Z',
  },
  {
    id: 'res-002',
    customerName: 'Jean Martin',
    customerPhone: '+33 6 98 76 54 32',
    date: '2024-12-20',
    time: '20:00',
    guests: 2,
    status: 'pending',
    source: 'call',
    createdAt: '2024-12-19T15:45:00Z',
  },
  {
    id: 'res-003',
    customerName: 'Sophie Bernard',
    customerPhone: '+33 6 11 22 33 44',
    date: '2024-12-21',
    time: '12:30',
    guests: 6,
    status: 'pending',
    notes: 'Business lunch, need quiet area',
    source: 'sms',
    createdAt: '2024-12-19T16:20:00Z',
  },
  {
    id: 'res-004',
    customerName: 'Pierre Leroy',
    customerPhone: '+33 6 55 66 77 88',
    date: '2024-12-19',
    time: '19:00',
    guests: 3,
    status: 'accepted',
    source: 'whatsapp',
    createdAt: '2024-12-18T10:00:00Z',
  },
  {
    id: 'res-005',
    customerName: 'Claire Moreau',
    customerPhone: '+33 6 99 88 77 66',
    date: '2024-12-19',
    time: '20:30',
    guests: 2,
    status: 'declined',
    notes: 'Fully booked',
    source: 'call',
    createdAt: '2024-12-18T11:30:00Z',
  },
  {
    id: 'res-006',
    customerName: 'Thomas Petit',
    customerPhone: '+33 6 44 33 22 11',
    date: '2024-12-18',
    time: '19:30',
    guests: 5,
    status: 'accepted',
    source: 'sms',
    createdAt: '2024-12-17T09:15:00Z',
  },
];

// Mock Messages
export const messages: Message[] = [
  {
    id: 'msg-001',
    reservationId: 'res-001',
    customerName: 'Marie Dupont',
    customerPhone: '+33 6 12 34 56 78',
    unreadCount: 2,
    lastMessageAt: '2024-12-19T14:35:00Z',
    messages: [
      {
        id: 'chat-001',
        content: 'Bonjour, je voudrais réserver une table pour 4 personnes vendredi soir pour notre anniversaire de mariage.',
        sender: 'customer',
        timestamp: '2024-12-19T14:30:00Z',
        read: true,
      },
      {
        id: 'chat-002',
        content: 'Bien sûr ! Quelle heure vous conviendrait ?',
        sender: 'restaurant',
        timestamp: '2024-12-19T14:32:00Z',
        read: true,
      },
      {
        id: 'chat-003',
        content: '19h30 serait parfait. Est-il possible d\'avoir une table près de la fenêtre ?',
        sender: 'customer',
        timestamp: '2024-12-19T14:33:00Z',
        read: false,
      },
      {
        id: 'chat-004',
        content: 'Merci beaucoup !',
        sender: 'customer',
        timestamp: '2024-12-19T14:35:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'msg-002',
    reservationId: 'res-003',
    customerName: 'Sophie Bernard',
    customerPhone: '+33 6 11 22 33 44',
    unreadCount: 1,
    lastMessageAt: '2024-12-19T16:22:00Z',
    messages: [
      {
        id: 'chat-005',
        content: 'Bonjour, nous organisons un déjeuner d\'affaires samedi. 6 personnes, vers 12h30. Zone calme si possible.',
        sender: 'customer',
        timestamp: '2024-12-19T16:20:00Z',
        read: true,
      },
      {
        id: 'chat-006',
        content: 'Pouvez-vous confirmer la disponibilité ?',
        sender: 'customer',
        timestamp: '2024-12-19T16:22:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'msg-003',
    reservationId: 'res-004',
    customerName: 'Pierre Leroy',
    customerPhone: '+33 6 55 66 77 88',
    unreadCount: 0,
    lastMessageAt: '2024-12-18T10:15:00Z',
    messages: [
      {
        id: 'chat-007',
        content: 'Table pour 3, ce soir 19h ?',
        sender: 'customer',
        timestamp: '2024-12-18T10:00:00Z',
        read: true,
      },
      {
        id: 'chat-008',
        content: 'Parfait, votre table est réservée ! À ce soir.',
        sender: 'restaurant',
        timestamp: '2024-12-18T10:15:00Z',
        read: true,
      },
    ],
  },
];

// Mock Call Logs
export const callLogs: CallLog[] = [
  {
    id: 'call-001',
    customerName: 'Jean Martin',
    customerPhone: '+33 6 98 76 54 32',
    duration: 0,
    type: 'missed',
    timestamp: '2024-12-19T15:40:00Z',
    hasVoicemail: true,
  },
  {
    id: 'call-002',
    customerPhone: '+33 6 77 88 99 00',
    duration: 0,
    type: 'missed',
    timestamp: '2024-12-19T14:20:00Z',
    hasVoicemail: false,
  },
  {
    id: 'call-003',
    customerName: 'Claire Moreau',
    customerPhone: '+33 6 99 88 77 66',
    duration: 45,
    type: 'received',
    timestamp: '2024-12-19T11:30:00Z',
    hasVoicemail: false,
  },
  {
    id: 'call-004',
    customerName: 'Pierre Leroy',
    customerPhone: '+33 6 55 66 77 88',
    duration: 120,
    type: 'outgoing',
    timestamp: '2024-12-18T16:00:00Z',
    hasVoicemail: false,
  },
  {
    id: 'call-005',
    customerPhone: '+33 6 11 00 99 88',
    duration: 0,
    type: 'missed',
    timestamp: '2024-12-18T13:45:00Z',
    hasVoicemail: true,
  },
];

// Stats for dashboard
export const dashboardStats = {
  pendingRequests: 3,
  todayReservations: 8,
  missedCalls: 3,
  unreadMessages: 3,
  weeklyAcceptRate: 87,
  averageResponseTime: '12 min',
};
