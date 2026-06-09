import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MessagesPage from '../../components/MessagesPage';
import { messageService } from '../../services/messageService';
import type { MessageThread, Message } from '../../data/mockMessages';

vi.mock('../../services/messageService', () => ({
  messageService: {
    getAllThreads: vi.fn(),
    getMessagesByThreadId: vi.fn(),
    markThreadAsRead: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ currentUser: { uid: 'user1', displayName: 'John Smith' } }),
}));

const mockThreads: MessageThread[] = [
  {
    id: 'thread-1',
    participants: ['user1', 'user2'],
    participantNames: ['John Smith', 'Sarah Johnson'],
    lastMessage: 'That sounds great!',
    lastMessageTime: new Date('2025-01-25T14:30:00'),
    unreadCount: 2,
    relatedOfferTitle: 'Web Development Services',
  },
  {
    id: 'thread-2',
    participants: ['user1', 'user3'],
    participantNames: ['John Smith', 'Marcus Williams'],
    lastMessage: 'Let me send my portfolio.',
    lastMessageTime: new Date('2025-01-24T10:15:00'),
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  { id: 'm1', threadId: 'thread-1', senderId: 'user2', senderName: 'Sarah Johnson', content: 'Hi there!', timestamp: new Date('2025-01-25T14:00:00'), read: true },
  { id: 'm2', threadId: 'thread-1', senderId: 'user1', senderName: 'John Smith', content: 'Hello!', timestamp: new Date('2025-01-25T14:10:00'), read: true },
];

const renderPage = () => render(<BrowserRouter><MessagesPage /></BrowserRouter>);

describe('MessagesPage', () => {
  beforeEach(() => {
    vi.mocked(messageService.getAllThreads).mockResolvedValue(mockThreads);
    vi.mocked(messageService.getMessagesByThreadId).mockResolvedValue(mockMessages);
    vi.mocked(messageService.markThreadAsRead).mockResolvedValue(true);
    vi.mocked(messageService.sendMessage).mockResolvedValue({
      id: 'm-new', threadId: 'thread-1', senderId: 'user1', senderName: 'John Smith',
      content: 'New message', timestamp: new Date(), read: false,
    });
  });

  it('shows loading state initially', () => {
    renderPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the page header', async () => {
    renderPage();
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders thread list after loading', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByText('Marcus Williams')).toBeInTheDocument();
  });

  it('shows unread badge on threads with unread messages', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('2 new')).toBeInTheDocument());
  });

  it('shows related offer title on thread', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Re: Web Development Services')).toBeInTheDocument());
  });

  it('shows search input', async () => {
    renderPage();
    expect(screen.getByPlaceholderText('Search conversations...')).toBeInTheDocument();
  });

  it('filters threads by search term', async () => {
    renderPage();
    await waitFor(() => screen.getByText('Sarah Johnson'));
    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), { target: { value: 'Marcus' } });
    expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
    expect(screen.getByText('Marcus Williams')).toBeInTheDocument();
  });

  it('shows empty state when no threads match search', async () => {
    renderPage();
    await waitFor(() => screen.getByText('Sarah Johnson'));
    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), { target: { value: 'zzznomatch' } });
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });

  it('shows select-a-conversation prompt before any thread is chosen', async () => {
    renderPage();
    await waitFor(() => screen.getByText('Sarah Johnson'));
    expect(screen.getByText('Select a conversation')).toBeInTheDocument();
  });

  it('loads messages when a thread is selected', async () => {
    renderPage();
    await waitFor(() => screen.getByText('Sarah Johnson'));
    await act(async () => { fireEvent.click(screen.getByText('Sarah Johnson')); });
    await waitFor(() => expect(screen.getByText('Hi there!')).toBeInTheDocument());
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(messageService.markThreadAsRead).toHaveBeenCalledWith('thread-1');
  });

  it('sends a message and appends it to the thread', async () => {
    renderPage();
    await waitFor(() => screen.getByText('Sarah Johnson'));
    await act(async () => { fireEvent.click(screen.getByText('Sarah Johnson')); });
    await waitFor(() => screen.getByPlaceholderText('Type your message...'));

    fireEvent.change(screen.getByPlaceholderText('Type your message...'), { target: { value: 'New message' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^send$/i })); });

    expect(messageService.sendMessage).toHaveBeenCalledWith('thread-1', 'user1', 'John Smith', 'New message');
    await waitFor(() => expect(screen.getByText('New message')).toBeInTheDocument());
  });
});
