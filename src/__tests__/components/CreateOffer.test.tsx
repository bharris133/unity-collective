import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateOffer from '../../components/CreateOffer';

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user', email: 'test@example.com' },
    loading: false,
  })),
}));

describe('CreateOffer Component', () => {
  it('should render create offer form', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByText('Create New Offer')).toBeInTheDocument();
  });

  it('should display all form fields', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/)).toBeInTheDocument();
    expect(screen.getByText(/Offer Type/)).toBeInTheDocument();
  });

  it('should display offer type options', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByText('Trade')).toBeInTheDocument();
    expect(screen.getByText('Barter')).toBeInTheDocument();
    expect(screen.getByText('Collaboration')).toBeInTheDocument();
  });

  it('should display tips section', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tips for a Great Offer/)).toBeInTheDocument();
  });

  it('should have submit and cancel buttons', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByText('Create Offer')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should display back to offers button', () => {
    render(
      <BrowserRouter>
        <CreateOffer />
      </BrowserRouter>
    );

    expect(screen.getByText('Back to Offers')).toBeInTheDocument();
  });
});
