import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import JobDetailPage from '@/app/jobs/[id]/page';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '123' }),
  useRouter: () => ({ push: jest.fn() })
}));

// Minimal mock AuthProvider to set activeProfileId
const MockAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const mockJobResponse = {
  status: 'success',
  data: {
    id: 123,
    title: 'Sample Job',
    description: 'Job description',
    image: null,
    expiration_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    shooting_date: new Date().toISOString(),
    is_active: true,
    open_to_apply: true,
    highlights: 'Key points',
    usage_terms: 'Usage terms',
    roles: [
      {
        id: 1,
        name: 'Lead Role',
        description: 'Role description',
        gender: 'female',
        start_age: 18,
        end_age: 30,
        ethnicity: ['Arab'],
        payment_terms_days: 30,
        budget: 5000,
        can_apply: true,
        eligibility_score: 95,
        meta_conditions: [ { height: '170', eye_color: 'brown' } ],
        call_time_enabled: true,
        call_time_slots: [
          {
            date: new Date().toISOString().split("T")[0],
            slots: [
              {
                id: 1,
                start_time: '10:00:00',
                end_time: '10:30:00',
                interval_minutes: 30,
                max_talents: 2,
                available_times: [
                  { time: '10:00:00', available_spots: 2, is_fully_booked: false },
                  { time: '10:30:00', available_spots: 0, is_fully_booked: true }
                ]
              }
            ]
          }
        ],
        conditions: [ { id: 'c1', label: 'Must be available', is_required: true } ]
      }
    ],
    professions: ['Actor'],
    sub_professions: ['Host'],
    job_countries: ['UAE'],
    residence_countries: ['Lebanon']
  }
};

describe('JobDetailPage i18n', () => {
  beforeEach(() => {
    // Set auth token and active profile
    localStorage.setItem('auth_token', 'test');
    localStorage.setItem('active_profile_id', '1');
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJobResponse
    }) as any;
  });

  it('renders English strings', async () => {
    render(
      <I18nProvider>
        <MockAuth>
          <JobDetailPage />
        </MockAuth>
      </I18nProvider>
    );

    await waitFor(() => expect(screen.getByText('Back to Jobs')).toBeInTheDocument());
    expect(screen.getByText('Highlights:')).toBeInTheDocument();
    expect(screen.getByText('Usage Terms:')).toBeInTheDocument();
    expect(screen.getByText('Job Locations')).toBeInTheDocument();
    expect(screen.getByText('Residence Countries')).toBeInTheDocument();
  });

  it('renders Arabic strings when locale is ar', async () => {
    localStorage.setItem('locale', 'ar');
    render(
      <I18nProvider>
        <MockAuth>
          <JobDetailPage />
        </MockAuth>
      </I18nProvider>
    );

    await waitFor(() => expect(screen.getByText('العودة إلى الوظائف')).toBeInTheDocument());
    expect(screen.getByText('أبرز النقاط:')).toBeInTheDocument();
    expect(screen.getByText('شروط الاستخدام:')).toBeInTheDocument();
    expect(screen.getByText('مواقع الوظيفة')).toBeInTheDocument();
    expect(screen.getByText('دول الإقامة')).toBeInTheDocument();
  });
});
