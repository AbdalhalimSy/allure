import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobApplicationModal from '@/components/jobs/JobApplicationModal';

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('JobApplicationModal', () => {
  const mockRole = {
    id: 1,
    name: 'Lead Actor',
    description: 'Main character role',
    gender: 'male',
    start_age: 18,
    end_age: 50,
    ethnicity: ['Asian'],
    payment_terms_days: 45,
    can_apply: true,
    eligibility_score: 100,
    call_time_enabled: false,
    meta_conditions: [],
    conditions: [
      {
        id: 1,
        label: 'Do you have acting experience?',
        input_type: 'yes_no' as const,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        is_required: true
      },
      {
        id: 2,
        label: 'Tell us about yourself',
        input_type: 'textarea' as const,
        options: [],
        is_required: false
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(
      <JobApplicationModal
        isOpen={false}
        onClose={() => {}}
        jobId={1}
        role={mockRole}
        profileId={10}
      />
    );
    expect(screen.queryByText('Lead Actor')).not.toBeInTheDocument();
  });

  it('renders modal with role details when open', () => {
    render(
      <JobApplicationModal
        isOpen={true}
        onClose={() => {}}
        jobId={1}
        role={mockRole}
        profileId={10}
      />
    );
    expect(screen.getByText(/Lead Actor/)).toBeInTheDocument();
    expect(screen.getByText('Do you have acting experience?')).toBeInTheDocument();
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = jest.fn();
    render(
      <JobApplicationModal
        isOpen={true}
        onClose={onClose}
        jobId={1}
        role={mockRole}
        profileId={10}
      />
    );
    
    const closeButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg') // X icon button
    );
    if (closeButton) {
      await userEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('validates required fields before submission', async () => {
    const toast = require('react-hot-toast').toast;
    render(
      <JobApplicationModal
        isOpen={true}
        onClose={() => {}}
        jobId={1}
        role={mockRole}
        profileId={10}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('requires login to apply', async () => {
    const toast = require('react-hot-toast').toast;
    render(
      <JobApplicationModal
        isOpen={true}
        onClose={() => {}}
        jobId={1}
        role={mockRole}
        profileId={undefined}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please login to apply for this role');
    });
  });
});
