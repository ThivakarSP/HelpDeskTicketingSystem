import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTicket from '../components/CreateTicket';

jest.mock('../utils/api', () => ({
  createTicket: jest.fn(),
  extractErrorMessages: jest.requireActual('../utils/api').extractErrorMessages
}));
const { createTicket } = require('../utils/api');

describe('CreateTicket', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('shows client-side validation and disables submit', async () => {
    render(<CreateTicket />);
    await userEvent.type(screen.getByTestId('title-input'), 'abc');
    await userEvent.clear(screen.getByTestId('description-input'));
    await userEvent.selectOptions(screen.getByTestId('priority-select'), '');
    await userEvent.selectOptions(screen.getByTestId('category-select'), '');
    await userEvent.type(screen.getByTestId('reportedby-input'), 'bad-email');
    fireEvent.submit(screen.getByTestId('createticket-form'));
    await waitFor(() => {
      expect(screen.getByTestId('error-title')).toBeInTheDocument();
    });
    expect(screen.getByTestId('error-description')).toBeInTheDocument();
    expect(screen.getByTestId('error-priority')).toBeInTheDocument();
    expect(screen.getByTestId('error-category')).toBeInTheDocument();
    expect(screen.getByTestId('error-reportedby')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeDisabled();
  });

  test('submits valid form and shows success', async () => {
    createTicket.mockResolvedValueOnce({ id: 49, status: 'OPEN' });
    render(<CreateTicket />);
    await userEvent.type(screen.getByTestId('title-input'), 'Office WiFi is slow');
    await userEvent.type(screen.getByTestId('description-input'), 'WiFi signal repeatedly drops at desk.');
    await userEvent.selectOptions(screen.getByTestId('priority-select'), 'HIGH');
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'NETWORK');
    await userEvent.type(screen.getByTestId('reportedby-input'), 'dave@company.com');
    // Wait for all state transitions before checking button state
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).not.toBeDisabled();
    });
    userEvent.click(screen.getByTestId('add-button'));
    await screen.findByTestId('success-message');
  });

  test('shows backend validation errors', async () => {
    createTicket.mockRejectedValueOnce({
      errors: {
        title: 'Title must be between 5 and 100 characters',
        priority: 'Priority must be one of: LOW, MEDIUM, HIGH',
        reportedBy: 'Reported By must be a valid email'
      }
    });
    render(<CreateTicket />);
    await userEvent.type(screen.getByTestId('title-input'), 'T');
    await userEvent.type(screen.getByTestId('description-input'), 'Invalid stuff');
    fireEvent.change(screen.getByTestId('priority-select'), { target: { value: 'URGENT' } });
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'HARDWARE');
    await userEvent.type(screen.getByTestId('reportedby-input'), 'wrong@');
    // Button stays disabled due to bad priority/title
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).toBeDisabled();
    });
    // Now fix all fields to enable the submit button
    await userEvent.clear(screen.getByTestId('title-input'));
    await userEvent.type(screen.getByTestId('title-input'), 'Valid Title');
    await userEvent.clear(screen.getByTestId('description-input'));
    await userEvent.type(screen.getByTestId('description-input'), 'Now valid!');
    await userEvent.selectOptions(screen.getByTestId('priority-select'), 'HIGH');
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'SOFTWARE');
    await userEvent.clear(screen.getByTestId('reportedby-input'));
    await userEvent.type(screen.getByTestId('reportedby-input'), 'eva@team.com');
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).not.toBeDisabled();
    });
    userEvent.click(screen.getByTestId('add-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-title')).toBeInTheDocument();
      expect(screen.getByTestId('error-priority')).toBeInTheDocument();
      expect(screen.getByTestId('error-reportedby')).toBeInTheDocument();
    });
  });

  test('shows general API error for unexpected backend failure', async () => {
    createTicket.mockRejectedValueOnce({ message: 'Server error!' });
    render(<CreateTicket />);
    await userEvent.type(screen.getByTestId('title-input'), 'Valid title!');
    await userEvent.type(screen.getByTestId('description-input'), 'Valid desc!');
    await userEvent.selectOptions(screen.getByTestId('priority-select'), 'HIGH');
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'HARDWARE');
    await userEvent.type(screen.getByTestId('reportedby-input'), 'joe@company.com');
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).not.toBeDisabled();
    });
    userEvent.click(screen.getByTestId('add-button'));
    await screen.findByTestId('api-error');
    expect(screen.getByTestId('api-error')).toHaveTextContent(/server error!/i);
  });
});
