import React from 'react';
import { render, screen } from '@testing-library/react';
import JobList from '@/components/jobs/JobList';
import { Job } from '@/types/job';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('JobList', () => {
  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Actor Role',
      description: 'Acting opportunity',
      skills: 'Acting',
      shooting_dates: [{ date: '2025-12-01' }],
      expiration_date: '2025-11-30',
      open_to_apply: true,
      roles_count: 2,
      countries: ['UAE'],
      professions: ['Actor'],
      roles: []
    },
    {
      id: 2,
      title: 'Model Position',
      description: 'Fashion modeling',
      skills: 'Modeling',
    shooting_dates: [{ date: '2025-12-15' }],
      expiration_date: '2025-12-10',
      open_to_apply: true,
      roles_count: 1,
      countries: ['Saudi Arabia'],
      professions: ['Model'],
      roles: []
    }
  ];

  it('renders multiple job cards', () => {
    render(<JobList jobs={mockJobs} />);
    expect(screen.getByText('Actor Role')).toBeInTheDocument();
    expect(screen.getByText('Model Position')).toBeInTheDocument();
  });

  it('renders empty list gracefully', () => {
    const { container } = render(<JobList jobs={[]} />);
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(screen.queryByText('Actor Role')).not.toBeInTheDocument();
  });
});
