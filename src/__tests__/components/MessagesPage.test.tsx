import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessagesPage from '../../components/MessagesPage';

describe('MessagesPage Component', () => {
  it('should render messages page header', () => {
    render(<MessagesPage />);

    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('should display search input', () => {
    render(<MessagesPage />);

    const searchInput = screen.getByPlaceholderText('Search conversations...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display message threads', () => {
    render(<MessagesPage />);

    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Marcus Williams')).toBeInTheDocument();
    expect(screen.getByText('Lisa Brown')).toBeInTheDocument();
  });

  it('should display related offer titles', () => {
    render(<MessagesPage />);

    expect(screen.getByText(/Looking for Web Development Services/)).toBeInTheDocument();
    expect(screen.getByText(/Need Logo Design/)).toBeInTheDocument();
  });

  it('should display unread message counts', () => {
    render(<MessagesPage />);

    expect(screen.getByText('2 new')).toBeInTheDocument();
    expect(screen.getByText('1 new')).toBeInTheDocument();
  });

  it('should display select conversation prompt', () => {
    render(<MessagesPage />);

    expect(screen.getByText('Select a conversation')).toBeInTheDocument();
    expect(screen.getByText('Choose a thread from the left to start messaging')).toBeInTheDocument();
  });
});
