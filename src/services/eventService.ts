import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockEvents, type Event } from '../data';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Event Service
 * 
 * Provides a unified interface for fetching community event data.
 * Automatically switches between mock data and Firebase based on environment variable.
 */

export const eventService = {
  /**
   * Get all events
   */
  async getAll(): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      console.log('📦 Using mock data for events');
      return Promise.resolve(mockEvents);
    }

    console.log('🔥 Fetching events from Firebase');
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as Event));
    } catch (error) {
      console.error('Error fetching events from Firebase:', error);
      console.log('⚠️ Falling back to mock data');
      return mockEvents;
    }
  },

  /**
   * Get a single event by ID
   */
  async getById(id: number): Promise<Event | null> {
    if (USE_MOCK_DATA) {
      console.log(`📦 Using mock data for event ${id}`);
      return Promise.resolve(mockEvents.find(e => e.id === id) || null);
    }

    console.log(`🔥 Fetching event ${id} from Firebase`);
    try {
      const docRef = doc(db, 'events', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: parseInt(docSnap.id),
          ...docSnap.data()
        } as Event;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching event ${id} from Firebase:`, error);
      console.log('⚠️ Falling back to mock data');
      return mockEvents.find(e => e.id === id) || null;
    }
  },

  /**
   * Get events by type (Virtual or In-Person)
   */
  async getByType(type: 'Virtual' | 'In-Person'): Promise<Event[]> {
    const allEvents = await this.getAll();
    return allEvents.filter(e => e.type === type);
  },

  /**
   * Get upcoming events (sorted by date)
   */
  async getUpcoming(limit?: number): Promise<Event[]> {
    const allEvents = await this.getAll();
    const now = new Date();
    
    // Filter future events and sort by date
    const upcomingEvents = allEvents
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  }
};
