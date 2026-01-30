import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsList from '../../components/ReviewsList';
import React from 'react';

describe('ReviewsList', () => {
  const mockReviews = [
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Doe',
      rating: 5,
      title: 'Excellent service!',
      comment: 'This is a great vendor with amazing products. Highly recommended!',
      helpful: 10,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Jane Smith',
      rating: 4,
      title: 'Very good',
      comment: 'Good quality products and fast shipping. Would buy again.',
      helpful: 5,
      createdAt: new Date('2024-01-10'),
    },
  ];

  it('should render the reviews list', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });

  it('should display average rating', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should display total reviews count', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText('2 reviews')).toBeInTheDocument();
  });

  it('should display all reviews', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText('Excellent service!')).toBeInTheDocument();
    expect(screen.getByText('Very good')).toBeInTheDocument();
  });

  it('should display reviewer names', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display review comments', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText(/This is a great vendor/)).toBeInTheDocument();
    expect(screen.getByText(/Good quality products/)).toBeInTheDocument();
  });

  it('should display helpful counts', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByText(/Helpful \(10\)/)).toBeInTheDocument();
    expect(screen.getByText(/Helpful \(5\)/)).toBeInTheDocument();
  });

  it('should show empty state when no reviews', () => {
    render(<ReviewsList reviews={[]} averageRating={0} totalReviews={0} />);
    expect(screen.getByText('No reviews yet. Be the first to review!')).toBeInTheDocument();
  });

  it('should display sort dropdown', () => {
    render(<ReviewsList reviews={mockReviews} averageRating={4.5} totalReviews={2} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
