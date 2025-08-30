import React, { useState, useEffect } from 'react';

const TicketList = ({ onViewDetails }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  if (loading) return <div className="container">Loading tickets...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h1>All Tickets</h1>
      {tickets.length === 0 ? (
        <div className="card">
          <p>No tickets found. <a href="/create">Create the first ticket</a></p>
        </div>
      ) : (
        <div>
          {tickets.map(ticket => (
            <div key={ticket.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{ticket.title}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{ticket.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className={getStatusClass(ticket.status)}>{ticket.status}</span>
                    <span className={getPriorityClass(ticket.priority)}>
                      Priority: {ticket.priority}
                    </span>
                    <span style={{ color: '#666' }}>Category: {ticket.category}</span>
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                    Reported by: {ticket.reportedBy} • Created: {formatDate(ticket.createdAt)}
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => onViewDetails(ticket.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
