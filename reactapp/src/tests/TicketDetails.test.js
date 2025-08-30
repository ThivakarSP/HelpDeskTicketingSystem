import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketDetails from '../components/TicketDetails';

jest.mock('../utils/api', () => ({
  fetchTicketById: jest.fn(),
  updateTicketStatus: jest.fn(),
  extractErrorMessages: jest.requireActual('../utils/api').extractErrorMessages
}));
const { fetchTicketById, updateTicketStatus } = require('../utils/api');

describe('TicketDetails', () => {
  afterEach(() => jest.clearAllMocks());

  const ticket = {
    id: 5,
    title: 'Monitor flickering',
    description: 'Screen intermittently flickers when HDMI is connected.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'HARDWARE',
    reportedBy: 'eve@company.com',
    createdAt: '2024-06-01T14:21:55',
    updatedAt: '2024-06-01T17:00:11'
  };

  test('shows loading and ticket details, all fields present', async () => {
    fetchTicketById.mockResolvedValueOnce(ticket);
    render(<TicketDetails ticketId={5} />);
    expect(screen.getByText(/loading ticket details/i)).toBeInTheDocument();
    await screen.findByTestId('ticketdetails-root');
    expect(screen.getByText('Monitor flickering')).toBeInTheDocument();
    // For status, search for text within the ticket info table, not in <option>
    const detailsTable = screen.getByRole('table');
    const statusCell = within(detailsTable).getAllByText('OPEN').find(
      cell => cell.tagName === 'TD'
    );
    expect(statusCell).toBeInTheDocument();
    expect(screen.getByText('eve@company.com')).toBeInTheDocument();
    expect(screen.getByText('Screen intermittently flickers when HDMI is connected.')).toBeInTheDocument();
    expect(screen.getByText('HARDWARE')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('2024-06-01 14:21:55')).toBeInTheDocument();
    expect(screen.getByText('2024-06-01 17:00:11')).toBeInTheDocument();
  });

  test('shows error if ticket not found', async () => {
    fetchTicketById.mockRejectedValueOnce({ message: 'Not found' });
    render(<TicketDetails ticketId={999} />);
    await screen.findByTestId('ticketdetails-error');
    expect(screen.getByText(/ticket not found/i)).toBeInTheDocument();
  });

  test('can update status and see success', async () => {
    fetchTicketById.mockResolvedValueOnce(ticket);
    updateTicketStatus.mockResolvedValueOnce({ ...ticket, status: 'IN_PROGRESS' });
    render(<TicketDetails ticketId={5} />);
    await screen.findByTestId('ticketdetails-root');
    fireEvent.change(screen.getByTestId('status-select'), { target: { value: 'IN_PROGRESS' } });
    fireEvent.change(screen.getByTestId('status-comment'), { target: { value: 'Started investigation.' } });
    userEvent.click(screen.getByTestId('updatestatus-button'));
    await screen.findByTestId('status-success');
    expect(updateTicketStatus).toHaveBeenCalledWith(5, { status: 'IN_PROGRESS', comment: 'Started investigation.' });
  });

  test('shows error for invalid status', async () => {
    fetchTicketById.mockResolvedValueOnce(ticket);
    render(<TicketDetails ticketId={5} />);
    await screen.findByTestId('ticketdetails-root');
    fireEvent.change(screen.getByTestId('status-select'), { target: { value: 'INVALID_STATUS' } });
    userEvent.click(screen.getByTestId('updatestatus-button'));
    await screen.findByTestId('status-error');
    expect(screen.getByTestId('status-error')).toHaveTextContent(/must be one of/i);
  });

  test('shows API error for backend failure', async () => {
    fetchTicketById.mockResolvedValueOnce(ticket);
    updateTicketStatus.mockRejectedValueOnce({ message: 'Failed to update!' });
    render(<TicketDetails ticketId={5} />);
    await screen.findByTestId('ticketdetails-root');
    userEvent.click(screen.getByTestId('updatestatus-button'));
    await screen.findByTestId('status-error');
    expect(screen.getByTestId('status-error')).toHaveTextContent(/failed to update/i);
  });
});
