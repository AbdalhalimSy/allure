import React from 'react';
import { render, screen } from '@testing-library/react';
import JobCard from '@/components/jobs/cards/JobCard';
import { Job } from '@/types/job';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('JobCard', () => {
  const mockJob: Job = {
    id: 1,
    title: 'Lead Actor for Drama Series',
    description: 'Seeking experienced actor for leading role in upcoming drama series',
    skills: 'Acting, Drama, Emotional Range',
    shooting_dates: [{ date: '2025-12-01' }],
    expiration_date: '2025-11-30',
    open_to_apply: true,
    roles_count: 3,
    countries: ['Saudi Arabia', 'UAE', 'Egypt'],
    professions: ['Actor', 'Model', 'Voice Artist', 'Dancer'],
    roles: []
  };

  it('renders job title and description', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Lead Actor for Drama Series')).toBeInTheDocument();
    expect(screen.getByText(/Seeking experienced actor/)).toBeInTheDocument();
  });

  it('displays shooting and expiration dates', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText(/Dec 1, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/Nov 30, 2025/)).toBeInTheDocument();
  });

  it('shows countries with overflow indicator', () => {
    render(<JobCard job={mockJob} />);
    const countriesText = screen.getByText(/Saudi Arabia, UAE/);
    expect(countriesText).toBeInTheDocument();
    expect(countriesText.textContent).toContain('+1');
  });

  it('displays roles count', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('3 Roles Available')).toBeInTheDocument();
  });

  it('shows required skills section', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Required Skills')).toBeInTheDocument();
    expect(screen.getByText(/Acting, Drama, Emotional Range/)).toBeInTheDocument();
  });

  it('renders profession tags with overflow indicator', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Actor')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Voice Artist')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('shows expiring soon badge for jobs expiring within 7 days', () => {
    const today = new Date();
    const expiringDate = new Date(today);
    expiringDate.setDate(today.getDate() + 5);
    
    const expiringJob = {
      ...mockJob,
      expiration_date: expiringDate.toISOString().split('T')[0]
    };
    
    render(<JobCard job={expiringJob} />);
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
  });

  it('has link to job details page', () => {
    render(<JobCard job={mockJob} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/jobs/1');
  });
});
