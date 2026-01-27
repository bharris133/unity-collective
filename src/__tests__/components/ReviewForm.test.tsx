import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewForm from '../../components/ReviewForm';
import React from 'react';

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: { uid: 'test-user', displayName: 'Test User' },
    loading: false,
  })),
}));

describe('ReviewForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    targetType: 'vendor' as const,
    targetId: 'vendor-1',
    targetName: 'Test Vendor',
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  it('should render the review form', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText(/Write a Review for Test Vendor/)).toBeInTheDocument();
  });

  it('should display rating stars', () => {
    render(<ReviewForm {...defaultProps} />);
    const stars = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg')
    );
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('should display title input field', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByLabelText(/Review Title/)).toBeInTheDocument();
  });

  it('should display comment textarea', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByLabelText(/Your Review/)).toBeInTheDocument();
  });

  it('should show validation error when submitting without rating', () => {
    render(<ReviewForm {...defaultProps} />);
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);
    expect(screen.getByText('Please select a rating')).toBeInTheDocument();
  });

  it('should show validation error for short title', () => {
    render(<ReviewForm {...defaultProps} />);
    const titleInput = screen.getByLabelText(/Review Title/);
    fireEvent.change(titleInput, { target: { value: 'Hi' } });
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);
    expect(screen.getByText('Title must be at least 5 characters')).toBeInTheDocument();
  });

  it('should show validation error for short comment', () => {
    render(<ReviewForm {...defaultProps} />);
    const commentTextarea = screen.getByLabelText(/Your Review/);
    fireEvent.change(commentTextarea, { target: { value: 'Short' } });
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);
    expect(screen.getByText('Review must be at least 20 characters')).toBeInTheDocument();
  });

  it('should display cancel button when onCancel is provided', () => {
    render(<ReviewForm {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ReviewForm {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
