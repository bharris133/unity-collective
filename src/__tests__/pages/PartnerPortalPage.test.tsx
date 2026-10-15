import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PartnerPortalPage from '../../pages/PartnerPortalPage';
import { useAuth } from '../../contexts/AuthContext';
import { partnerService } from '../../services/partnerService';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/partnerService', () => ({
  partnerService: {
    getMyPortalAccess: vi.fn(),
    listCandidates: vi.fn(),
    createCandidates: vi.fn(),
    provisionOrganization: vi.fn(),
  },
  parsePartnerCandidateCsv: vi.fn(),
  validatePartnerCandidate: vi.fn(() => []),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedPartnerService = vi.mocked(partnerService);

function renderPage() {
  return render(<MemoryRouter><PartnerPortalPage /></MemoryRouter>);
}

describe('PartnerPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      currentUser: { uid: 'partner-staff-1' },
      userProfile: { isAdmin: false },
    } as ReturnType<typeof useAuth>);
  });

  it('denies a signed-in user without active Partner Portal access', async () => {
    mockedPartnerService.getMyPortalAccess.mockResolvedValue(null);

    renderPage();

    expect(await screen.findByText('Partner Portal Access Required')).toBeInTheDocument();
    expect(screen.getByText(/does not have active Partner Portal access/i)).toBeInTheDocument();
  });

  it('keeps candidate entry private and requires the partner contact attestation', async () => {
    mockedPartnerService.getMyPortalAccess.mockResolvedValue({
      organization: {
        name: 'Chicago Enterprise Network', city: 'Chicago', state: 'IL', agreementVersion: 'v1', active: true,
      },
      staff: { role: 'staff', active: true },
    });
    mockedPartnerService.listCandidates.mockResolvedValue([]);
    mockedPartnerService.createCandidates.mockResolvedValue({ createdCount: 1 });

    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText('Add One Private Candidate')).toBeInTheDocument();
    expect(screen.getByText(/does not create a public business listing/i)).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: 'Save Private Candidate' });
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByLabelText('Business name'), 'Heritage Market');
    await user.type(screen.getByLabelText('Primary contact name'), 'Jordan Smith');
    await user.type(screen.getByLabelText('Contact email'), 'jordan@example.com');
    await user.type(screen.getByLabelText('City'), 'Chicago');
    await user.type(screen.getByLabelText('State'), 'IL');
    await user.click(screen.getByRole('checkbox'));
    await user.click(saveButton);

    await waitFor(() => expect(mockedPartnerService.createCandidates).toHaveBeenCalledWith([
      expect.objectContaining({ businessName: 'Heritage Market', contactEmail: 'jordan@example.com', city: 'Chicago', state: 'IL' }),
    ]));
    expect(await screen.findByText(/Candidate saved to the private partner list/i)).toBeInTheDocument();
  });

  it('requires an administrator to record training confirmation before provisioning portal access', async () => {
    mockedUseAuth.mockReturnValue({
      currentUser: { uid: 'admin-1' },
      userProfile: { isAdmin: true },
    } as ReturnType<typeof useAuth>);
    mockedPartnerService.getMyPortalAccess.mockResolvedValue(null);
    mockedPartnerService.provisionOrganization.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByText('Provision Partner Portal Access')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Official organization name'), 'Chicago Enterprise Network');
    await user.type(screen.getByLabelText('Partner staff account email'), 'staff@example.com');
    await user.type(screen.getByLabelText('City'), 'Chicago');
    await user.type(screen.getByLabelText('State'), 'IL');
    await user.type(screen.getByLabelText('Agreement version'), 'pilot-v1');
    await user.click(screen.getByRole('button', { name: 'Create Partner Portal Access' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/confirm training/i);
    expect(mockedPartnerService.provisionOrganization).not.toHaveBeenCalled();

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create Partner Portal Access' }));

    await waitFor(() => expect(mockedPartnerService.provisionOrganization).toHaveBeenCalledWith({
      name: 'Chicago Enterprise Network',
      staffEmail: 'staff@example.com',
      city: 'Chicago',
      state: 'IL',
      agreementVersion: 'pilot-v1',
      trainingConfirmed: true,
    }));
  });
});
