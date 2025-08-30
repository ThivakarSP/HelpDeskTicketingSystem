import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketList from '../components/TicketList';

jest.mock('../utils/api', () => ({
  fetchAllTickets: jest.fn()
}));
const { fetchAllTickets } = require('../utils/api');

describe('TicketList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading, populated, and empty states', async () => {
    fetchAllTickets.mockResolvedValueOnce([
      {
        id: 1, title: 'Printer not working', status: 'OPEN', priority: 'HIGH', category: 'HARDWARE', reportedBy: 'alice@company.com'
      },
      {
        id: 2, title: 'VPN Access', status: 'IN_PROGRESS', priority: 'MEDIUM', category: 'NETWORK', reportedBy: 'bob@company.com'
      }
    ]);
    render(<TicketList />);
    expect(screen.getByTestId('ticketlist-loading')).toBeInTheDocument();
    await screen.findByTestId('ticketlist-table');
    expect(screen.getByText('Printer not working')).toBeInTheDocument();
    expect(screen.getByText('VPN Access')).toBeInTheDocument();
  });

  test('shows empty state if no tickets', async () => {
    fetchAllTickets.mockResolvedValueOnce([]);
    render(<TicketList />);
    await screen.findByTestId('ticketlist-empty');
    expect(screen.getByText(/no tickets found/i)).toBeInTheDocument();
  });

  test('calls onViewDetails when button clicked', async () => {
    fetchAllTickets.mockResolvedValueOnce([
      { id: 3, title: 'Software Update', status: 'RESOLVED', priority: 'LOW', category: 'SOFTWARE', reportedBy: 'clara@company.com' }
    ]);
    const onViewDetails = jest.fn();
    render(<TicketList onViewDetails={onViewDetails} />);
    await screen.findByTestId('ticketlist-table');
    const viewButton = screen.getByTestId('ticketlist-viewdetails-3');
    userEvent.click(viewButton);
    expect(onViewDetails).toHaveBeenCalledWith(3);
  });

  test('shows error state', async () => {
    fetchAllTickets.mockRejectedValueOnce(new Error('Network fail'));
    render(<TicketList />);
    await screen.findByTestId('ticketlist-error');
    expect(screen.getByText(/failed to load tickets/i)).toBeInTheDocument();
  });
});
