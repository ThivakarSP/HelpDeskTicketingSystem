import React, { useState, useEffect } from 'react';

const UserTicketList = ({ userTicketsOnly = false }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  useEffect(() => {
    fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      
      // Filter tickets if userTicketsOnly is true
      let filteredTickets = data;
      if (userTicketsOnly) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        filteredTickets = data.filter(ticket => {
          if (!ticket.submitter || !currentUser.id) return false;
          
          // Check multiple possible user identification methods
          return (
            ticket.submitter.id === currentUser.id ||
            ticket.submitter.id === parseInt(currentUser.id) ||
            ticket.submitter.email === currentUser.email ||
            ticket.submitter.username === currentUser.username
          );
        });
      }
      
      setTickets(filteredTickets);
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
    return priority ? `priority-${priority.toLowerCase()}` : '';
  };

  if (loading) return <div className="container">Loading tickets...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  // Sorting logic
  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (sortField === 'priority') {
      // Custom priority order: High > Medium > Low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[(aValue || '').toLowerCase()] || 0;
      bValue = priorityOrder[(bValue || '').toLowerCase()] || 0;
    }
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    if (sortField === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <h1>{userTicketsOnly ? 'My Tickets' : 'All Tickets'}</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor="sortField">Sort by:</label>
        <select id="sortField" value={sortField} onChange={e => { setSortField(e.target.value); setCurrentPage(1); }}>
          <option value="createdAt">Date Created</option>
          <option value="id">Ticket ID</option>
          <option value="priority">Priority</option>
        </select>
        <button onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setCurrentPage(1); }}>
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      {tickets.length === 0 ? (
        <div className="card">
          <p>
            {userTicketsOnly 
              ? "You haven't submitted any tickets yet. " 
              : "No tickets found. "
            }
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#3498db', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                padding: 0,
                font: 'inherit'
              }}
              onClick={() => window.location.href = '/user'}
            >
              {userTicketsOnly ? "Create your first ticket" : "Create the first ticket"}
            </button>
          </p>
        </div>
      ) : (
        <>
          <div>
            {currentTickets.map(ticket => (
              <div key={ticket.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{ticket.title}</h3>
                    <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{ticket.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className={getStatusClass(ticket.status)}>{ticket.status}</span>
                      {ticket.priority && (
                        <span className={getPriorityClass(ticket.priority)}>
                          Priority: {ticket.priority}
                        </span>
                      )}
                      {ticket.category && (
                        <span style={{ color: '#666' }}>Category: {ticket.category}</span>
                      )}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                      {ticket.submitter ? `Submitter: ${ticket.submitter.username || ticket.submitter.id}` : 'Submitter: —'} • Created: {ticket.createdAt ? formatDate(ticket.createdAt) : '—'}
                      {ticket.assignedAgent && (
                        <> • Assigned: {ticket.assignedAgent.username || ticket.assignedAgent.id}</>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => console.log('View ticket details:', ticket.id)}
                    >
                      View Details
                    </button>
                    {/* Users cannot delete tickets - removed delete button */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: '2rem', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              style={{
                padding: '0.6rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff',
                color: currentPage === 1 ? '#adb5bd' : '#495057',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 1) {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.backgroundColor = '#f8f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 1) {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.backgroundColor = '#fff';
                }
              }}
            >
              ⟨ Previous
            </button>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.25rem',
              alignItems: 'center',
              margin: '0 0.5rem'
            }}>
              {(() => {
                const maxVisiblePages = 5;
                const pages = [];
                
                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Smart pagination for many pages
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);
                  
                  if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('...');
                  }
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                  }
                }
                
                return pages.map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        style={{
                          padding: '0 0.5rem',
                          color: '#6c757d',
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        …
                      </span>
                    );
                  }
                  
                  const isCurrentPage = currentPage === pageNum;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: isCurrentPage ? '2px solid #3498db' : '2px solid #e1e5e9',
                        borderRadius: '50%',
                        backgroundColor: isCurrentPage ? '#3498db' : '#fff',
                        color: isCurrentPage ? '#fff' : '#495057',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: isCurrentPage ? '600' : '500',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrentPage ? '0 4px 12px rgba(52, 152, 219, 0.3)' : 'none'
                      }}
                      onMouseOver={(e) => {
                        if (!isCurrentPage) {
                          e.target.style.borderColor = '#3498db';
                          e.target.style.backgroundColor = '#f8f9ff';
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.2)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isCurrentPage) {
                          e.target.style.borderColor = '#e1e5e9';
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                padding: '0.6rem 1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#f8f9fa' : '#fff',
                color: (currentPage === totalPages || totalPages === 0) ? '#adb5bd' : '#495057',
                cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.backgroundColor = '#f8f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.target.style.borderColor = '#e1e5e9';
                  e.target.style.backgroundColor = '#fff';
                }
              }}
            >
              Next ⟩
            </button>
          </div>
          
          {/* Page Info */}
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#6c757d',
            fontSize: '0.9rem'
          }}>
            Page {currentPage} of {totalPages} • Showing {currentTickets.length} of {sortedTickets.length} tickets
          </div>
        </>
      )}
    </div>
  );
};

export default UserTicketList;