import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OffersPage from '../../components/OffersPage';

describe('OffersPage Component', () => {
  it('should render offers page with header', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Community Offers')).toBeInTheDocument();
    expect(screen.getByText(/Connect with community members/)).toBeInTheDocument();
  });

  it('should display search input', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search offers...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display filter dropdown', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('should display create offer button', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    const createButton = screen.getByText('Create Offer');
    expect(createButton).toBeInTheDocument();
  });

  it('should display stats cards', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Offers')).toBeInTheDocument();
    expect(screen.getByText('Open Offers')).toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getByText('Total Responses')).toBeInTheDocument();
  });

  it('should display mock offers', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Looking for Web Development Services')).toBeInTheDocument();
    expect(screen.getByText('Offering Catering Services')).toBeInTheDocument();
  });

  it('should display offer status badges', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText('open').length).toBeGreaterThan(0);
    expect(screen.getByText('in-progress')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should display offer categories', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getByText('Food & Beverage')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('should display response counts', () => {
    render(
      <BrowserRouter>
        <OffersPage />
      </BrowserRouter>
    );

    expect(screen.getByText('3 responses')).toBeInTheDocument();
    expect(screen.getByText('5 responses')).toBeInTheDocument();
    expect(screen.getByText('8 responses')).toBeInTheDocument();
  });
});
