export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'Virtual' | 'In-Person';
  location?: string;
  attendees: number;
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Economic Empowerment Webinar",
    date: "2025-08-25",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 234
  },
  {
    id: 2,
    title: "Black Business Networking Mixer",
    date: "2025-09-02",
    time: "6:00 PM EST",
    type: "In-Person",
    location: "Atlanta, GA",
    attendees: 89
  },
  {
    id: 3,
    title: "Financial Literacy Workshop",
    date: "2025-09-10",
    time: "2:00 PM EST",
    type: "Virtual",
    attendees: 156
  },
  {
    id: 4,
    title: "Youth Entrepreneurship Summit",
    date: "2025-09-15",
    time: "10:00 AM EST",
    type: "In-Person",
    location: "Detroit, MI",
    attendees: 312
  },
  {
    id: 5,
    title: "Tech Skills Bootcamp",
    date: "2025-09-20",
    time: "6:00 PM EST",
    type: "Virtual",
    attendees: 178
  }
];
