import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFestas, Festa } from '../data/mockData';

interface EventContextType {
  events: Festa[];
  addEvent: (event: Festa) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<Festa>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Festa[]>(mockFestas);

  const addEvent = (event: Festa) => {
    setEvents(prevEvents => [event, ...prevEvents]);
  };

  const removeEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const updateEvent = (eventId: string, updates: Partial<Festa>) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}; 