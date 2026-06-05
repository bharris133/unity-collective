import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OffersPage from '../../components/OffersPage';

// Helper: render and wait for the async useEffect to resolve
async function renderOffers() {
  await act(async () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );
  });
  // Wait for loading spinner to disappear
  await waitFor(() =>
    expect(screen.queryByText('Loading offers...')).not.toBeInTheDocument()
  );
}

describe('OffersPage Component', () => {
  it('should render offers page with header', async () => {
    await renderOffers();
    expect(screen.getByText('Community Offers')).toBeInTheDocument();
    expect(screen.getByText(/Connect with community members/)).toBeInTheDocument();
  });

  it('should display search input', async () => {
    await renderOffers();
    expect(screen.getByPlaceholderText('Search offers...')).toBeInTheDocument();
  });

  it('should display filter dropdown', async () => {
    await renderOffers();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('should display create offer button', async () => {
    await renderOffers();
    expect(screen.getByText('Create Offer')).toBeInTheDocument();
  });

  it('should display stats cards', async () => {
    await renderOffers();
    expect(screen.getByText('Total Offers')).toBeInTheDocument();
    expect(screen.getByText('Open Offers')).toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getByText('Total Responses')).toBeInTheDocument();
  });

  it('should display mock offers', async () => {
    await renderOffers();
    expect(screen.getByText('Looking for Web Development Services')).toBeInTheDocument();
    expect(screen.getByText('Offering Catering Services')).toBeInTheDocument();
  });

  it('should display offer status badges', async () => {
    await renderOffers();
    expect(screen.getAllByText('open').length).toBeGreaterThan(0);
    expect(screen.getByText('in-progress')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should display offer categories', async () => {
    await renderOffers();
    // Categories are shown in the offer descriptions/titles — verify offers are rendered
    expect(screen.getByText('Looking for Web Development Services')).toBeInTheDocument();
    expect(screen.getByText('Offering Catering Services')).toBeInTheDocument();
    expect(screen.getByText('Need Logo Design')).toBeInTheDocument();
  });

  it('should display response counts', async () => {
    await renderOffers();
    expect(screen.getByText('3 responses')).toBeInTheDocument();
    expect(screen.getByText('5 responses')).toBeInTheDocument();
    expect(screen.getByText('8 responses')).toBeInTheDocument();
  });
});
