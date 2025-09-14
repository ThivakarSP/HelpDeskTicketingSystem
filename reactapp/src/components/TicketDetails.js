import React, { useState, useEffect } from 'react';

const TicketDetails = ({ ticketId, onStatusUpdate, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }
      const data = await response.json();
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      if (onStatusUpdate) {
        onStatusUpdate(updatedTicket);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }
      if (onBack) onBack(); else window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : '—';
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPriorityClass = (priority) => {
    return priority ? `priority-${priority.toLowerCase()}` : '';
  };

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = ['New', 'In Progress', 'Resolved', 'Closed']; // Updated to match backend enum
    return allStatuses.filter(status => status !== currentStatus);
  };

  if (loading) return <div className="container">Loading ticket...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!ticket) return <div className="container">Ticket not found</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '1rem' }}>
  <button type="button" onClick={() => (onBack ? onBack() : (window.location.href = '/'))} className="btn-secondary">← Back to All Tickets</button>
      </div>
      
      <div className="card">
        <h1>{ticket.title}</h1>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <strong>Status:</strong> <span className={getStatusClass(ticket.status)}>{ticket.status}</span>
          </div>
          <div>
            <strong>Priority:</strong> <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
          </div>
          <div>
            <strong>Category:</strong> {ticket.category}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Description</h3>
          <p style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            {ticket.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <strong>Submitter:</strong> {ticket.submitter ? (ticket.submitter.username || ticket.submitter.id) : '—'}
          </div>
          <div>
            <strong>Assigned Agent:</strong> {ticket.assignedAgent ? (ticket.assignedAgent.username || ticket.assignedAgent.id) : '—'}
          </div>
          <div>
            <strong>Created:</strong> {formatDate(ticket.createdAt)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3>Update Status</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {getAvailableStatuses(ticket.status).map(status => (
              <button
                key={status}
                className="btn-primary"
                onClick={() => updateStatus(status)}
                disabled={updating}
                style={{ 
                  opacity: updating ? 0.6 : 1,
                  cursor: updating ? 'not-allowed' : 'pointer'
                }}
              >
                {updating ? 'Updating...' : `Mark as ${status.replace('_', ' ')}`}
              </button>
            ))}
            </div>
          </div>
          <div>
            <button className="btn-danger" onClick={deleteTicket} style={{ backgroundColor: '#dc3545', color: '#fff' }}>Delete Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
