import React from 'react';
import TicketList from './TicketList';
import CreateTicket from './CreateTicket';
import TicketDetails from './TicketDetails';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';
import PriorityManagement from './PriorityManagement';
import KnowledgeBaseManagement from './KnowledgeBaseManagement';

const AdminPortal = () => {
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = React.useState(null);
  const [dashboardStats, setDashboardStats] = React.useState(null);
  const [statsLoading, setStatsLoading] = React.useState(false);
  const [statsError, setStatsError] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState(null);

  React.useEffect(() => {
    if (currentView === 'dashboard') {
      fetchDashboardStats();
    }
  }, [currentView]);

  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard statistics (${response.status})`);
      }
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      setStatsError(error.message);
      
      // Provide fallback demo data
      const fallbackStats = {
        totalTickets: 0,
        totalUsers: 0,
        statusCounts: {
          NEW: 0,
          IN_PROGRESS: 0,
          RESOLVED: 0,
          CLOSED: 0
        },
        priorityCounts: {
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0
        },
        categoryCounts: {
          'Technical Support': 0,
          'Software Request': 0,
          'Hardware Issue': 0,
          'Account Management': 0,
          'Network Problem': 0
        },
        recentTickets: [],
        highPriorityTickets: []
      };
      setDashboardStats(fallbackStats);
    } finally {
      setStatsLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleViewDetails = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentView('ticket-details');
  };

  const handleStatusFilter = (status) => {
    setCurrentView('tickets');
    setStatusFilter(status);
  };

  const handleBackToTickets = () => {
    setCurrentView('tickets');
    setSelectedTicketId(null);
    setStatusFilter(null); // Clear status filter when going back
  };

  const renderContent = () => {
    switch (currentView) {
      case 'tickets':
        return <TicketList onViewDetails={handleViewDetails} statusFilter={statusFilter} />;
      case 'ticket-details':
        return <TicketDetails 
          ticketId={selectedTicketId} 
          onStatusUpdate={() => {}} 
          onBack={handleBackToTickets} 
        />;
      case 'create-ticket':
        return <CreateTicket />;
      case 'users':
        return <UserManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'priorities':
        return <PriorityManagement />;
      case 'knowledge-base':
        return <KnowledgeBaseManagement />;
      default:
        return (
          <div style={{ 
            maxWidth: '1400px', 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{ 
              margin: '0 0 2rem 0', 
              color: '#2c3e50',
              fontSize: '2.5rem',
              fontWeight: '700',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🎯 Admin Dashboard
            </h1>
            
            {statsLoading && (
              <div style={{
                background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(116, 185, 255, 0.3)',
                animation: 'pulse 1.5s infinite'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>🔄 Loading dashboard statistics...</p>
              </div>
            )}
            
            {statsError && (
              <div style={{ 
                background: 'linear-gradient(135deg, #ff7675, #d63031)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(255, 118, 117, 0.3)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>⚠️ Error Loading Statistics</h3>
                <p style={{ margin: '0 0 1rem 0' }}>{statsError}</p>
                <button 
                  onClick={fetchDashboardStats} 
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  🔄 Retry
                </button>
              </div>
            )}
            
            {dashboardStats && (
              <>
                {/* Key Metrics Cards */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1.5rem', 
                  marginBottom: '3rem' 
                }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(116, 185, 255, 0.3)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(116, 185, 255, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(116, 185, 255, 0.3)';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', opacity: 0.9 }}>Total Tickets</h3>
                        <div style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1 }}>{dashboardStats.totalTickets}</div>
                      </div>
                      <div style={{ fontSize: '3rem', opacity: 0.7 }}>🎫</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'linear-gradient(135deg, #00b894, #00a085)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(0, 184, 148, 0.3)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 184, 148, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 184, 148, 0.3)';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', opacity: 0.9 }}>Total Users</h3>
                        <div style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1 }}>{dashboardStats.totalUsers}</div>
                      </div>
                      <div style={{ fontSize: '3rem', opacity: 0.7 }}>👥</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fd79a8, #e84393)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(253, 121, 168, 0.3)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(253, 121, 168, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(253, 121, 168, 0.3)';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', opacity: 0.9 }}>Open Tickets</h3>
                        <div style={{ fontSize: '3rem', fontWeight: '700', lineHeight: 1 }}>
                          {dashboardStats.openTickets || 0}
                        </div>
                      </div>
                      <div style={{ fontSize: '3rem', opacity: 0.7 }}>🔓</div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                  gap: '2rem', 
                  marginBottom: '3rem' 
                }}>
                  {/* Ticket Status Breakdown */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 1.5rem 0', 
                      color: '#2c3e50',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📊 Ticket Status Distribution
                    </h3>
                    <div style={{ marginTop: '1rem' }}>
                      {dashboardStats.statusCounts && Object.entries(dashboardStats.statusCounts).map(([status, count]) => (
                        <div 
                          key={status} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '1rem',
                            cursor: 'pointer',
                            padding: '1rem',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            background: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => handleStatusFilter(status)}
                          title={`Click to view ${status.replace('_', ' ').toLowerCase()} tickets`}
                        >
                          <span style={{ fontWeight: '600', color: '#2c3e50' }}>{status.replace('_', ' ')}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: `${Math.max((count / dashboardStats.totalTickets) * 120, 30)}px`,
                              height: '25px',
                              background: status === 'New' ? 'linear-gradient(135deg, #74b9ff, #0984e3)' : 
                                         status === 'In Progress' ? 'linear-gradient(135deg, #fdcb6e, #e17055)' : 
                                         status === 'Resolved' ? 'linear-gradient(135deg, #00b894, #00a085)' : 
                                         'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                              borderRadius: '12px',
                              minWidth: '30px',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                            }}></div>
                            <span style={{ 
                              fontWeight: '700', 
                              minWidth: '30px', 
                              color: '#2c3e50',
                              fontSize: '1.1rem'
                            }}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Breakdown */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 1.5rem 0', 
                      color: '#2c3e50',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      ⚡ Priority Distribution
                    </h3>
                    <div style={{ marginTop: '1rem' }}>
                      {dashboardStats.priorityCounts && Object.entries(dashboardStats.priorityCounts).map(([priority, count]) => (
                        <div key={priority} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '1rem',
                          padding: '1rem',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.5)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                          <span style={{ fontWeight: '600', color: '#2c3e50' }}>{priority}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: `${Math.max((count / dashboardStats.totalTickets) * 120, 30)}px`,
                              height: '25px',
                              background: priority === 'High' ? 'linear-gradient(135deg, #ff7675, #d63031)' : 
                                         priority === 'Medium' ? 'linear-gradient(135deg, #fdcb6e, #e17055)' : 
                                         priority === 'Low' ? 'linear-gradient(135deg, #00b894, #00a085)' :
                                         priority === 'Urgent' ? 'linear-gradient(135deg, #e84393, #d63031)' :
                                         'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                              borderRadius: '12px',
                              minWidth: '30px',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                            }}></div>
                            <span style={{ 
                              fontWeight: '700', 
                              minWidth: '30px', 
                              color: '#2c3e50',
                              fontSize: '1.1rem'
                            }}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '2rem', 
                  marginBottom: '3rem' 
                }}>
                  {/* Recent Tickets */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 1.5rem 0', 
                      color: '#2c3e50',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      🎫 Recent Tickets
                    </h3>
                    <div style={{ marginTop: '1rem' }}>
                      {dashboardStats.recentTickets?.length > 0 ? (
                        dashboardStats.recentTickets.map(ticket => (
                          <div key={ticket.id} style={{ 
                            padding: '1rem', 
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '12px', 
                            marginBottom: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                          onClick={() => handleViewDetails(ticket.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          >
                            <div style={{ 
                              fontWeight: '600', 
                              marginBottom: '0.5rem',
                              color: '#2c3e50',
                              fontSize: '1rem'
                            }}>
                              #{ticket.id} - {ticket.title}
                            </div>
                            <div style={{ 
                              fontSize: '0.9rem', 
                              color: '#7f8c8d',
                              display: 'flex',
                              gap: '1rem',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{ 
                                background: ticket.status === 'New' ? 'linear-gradient(135deg, #74b9ff, #0984e3)' :
                                           ticket.status === 'In Progress' ? 'linear-gradient(135deg, #fdcb6e, #e17055)' :
                                           ticket.status === 'Resolved' ? 'linear-gradient(135deg, #00b894, #00a085)' :
                                           'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                                color: 'white',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}>
                                {ticket.status}
                              </span>
                              <span style={{ 
                                background: ticket.priority === 'High' ? 'linear-gradient(135deg, #ff7675, #d63031)' :
                                           ticket.priority === 'Medium' ? 'linear-gradient(135deg, #fdcb6e, #e17055)' :
                                           'linear-gradient(135deg, #00b894, #00a085)',
                                color: 'white',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}>
                                {ticket.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ 
                          color: '#7f8c8d', 
                          fontStyle: 'italic',
                          textAlign: 'center',
                          padding: '2rem'
                        }}>No recent tickets</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Analytics */}
                {dashboardStats && dashboardStats.categoryCounts && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    marginBottom: '3rem'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 2rem 0', 
                      color: '#2c3e50',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      📁 Category Breakdown
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '1.5rem', 
                      marginTop: '1rem' 
                    }}>
                      {Object.entries(dashboardStats.categoryCounts).map(([category, count]) => (
                        <div key={category} style={{ 
                          textAlign: 'center', 
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          padding: '2rem',
                          borderRadius: '15px',
                          boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                          transform: 'translateY(0)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                        }}
                        >
                          <h4 style={{ 
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            opacity: 0.9
                          }}>{category}</h4>
                          <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '700', 
                            lineHeight: 1,
                            marginBottom: '0.5rem'
                          }}>{count}</div>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            opacity: 0.8,
                            fontWeight: '500'
                          }}>tickets</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                margin: '0 0 1rem 0', 
                color: '#2c3e50',
                fontSize: '1.5rem',
                fontWeight: '600',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>⚡ Quick Actions</h2>
              <p style={{ 
                textAlign: 'center', 
                color: '#7f8c8d',
                marginBottom: '2rem',
                fontSize: '1rem'
              }}>
                Use these shortcuts to quickly navigate to different sections
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', 
                marginTop: '2rem' 
              }}>
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(116, 185, 255, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('tickets')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(116, 185, 255, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(116, 185, 255, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>📋 All Tickets</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>View and manage all support tickets</p>
                  {dashboardStats && (
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: '500' }}>
                      {dashboardStats.totalTickets} total tickets
                    </div>
                  )}
                </div>
                
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #00b894, #00a085)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(0, 184, 148, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('users')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 184, 148, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 184, 148, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>👥 User Management</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Manage user accounts and permissions</p>
                  {dashboardStats && (
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: '500' }}>
                      {dashboardStats.totalUsers} total users
                    </div>
                  )}
                </div>
                
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #fdcb6e, #e17055)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(253, 203, 110, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('categories')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(253, 203, 110, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(253, 203, 110, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>🏷️ Categories</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Manage ticket categories</p>
                </div>
                
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(162, 155, 254, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('priorities')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(162, 155, 254, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(162, 155, 254, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>⚡ Priorities</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Manage ticket priorities</p>
                </div>
                
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #fd79a8, #e84393)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(253, 121, 168, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('knowledge-base')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(253, 121, 168, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(253, 121, 168, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>📚 Knowledge Base</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Manage help articles and FAQs</p>
                </div>
                
                <div style={{ 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #00cec9, #55a3ff)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(0, 206, 201, 0.3)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setCurrentView('create-ticket')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 206, 201, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 206, 201, 0.3)';
                }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>➕ Create Ticket</h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Create a new support ticket</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <nav style={{ 
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: '600',
          background: 'linear-gradient(45deg, #fff, #e8f4fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.5px'
        }}>
          Admin Portal
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{ 
              background: currentView === 'dashboard' ? 'rgba(255,255,255,0.25)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '0.7rem 1.5rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = currentView === 'dashboard' ? 'rgba(255,255,255,0.25)' : 'transparent';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('tickets')}
            style={{ 
              background: currentView === 'tickets' ? 'rgba(255,255,255,0.25)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '0.7rem 1.5rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = currentView === 'tickets' ? 'rgba(255,255,255,0.25)' : 'transparent';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Tickets
          </button>
          <button 
            onClick={() => setCurrentView('users')}
            style={{ 
              background: currentView === 'users' ? 'rgba(255,255,255,0.25)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '0.7rem 1.5rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = currentView === 'users' ? 'rgba(255,255,255,0.25)' : 'transparent';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Users
          </button>
          <button 
            onClick={() => setCurrentView('categories')}
            style={{ 
              background: currentView === 'categories' ? 'rgba(255,255,255,0.25)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', 
              padding: '0.7rem 1.5rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = currentView === 'categories' ? 'rgba(255,255,255,0.25)' : 'transparent';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Categories
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              border: 'none', 
              color: 'white', 
              padding: '0.7rem 1.5rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              marginLeft: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #c0392b, #a93226)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: '2rem' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPortal;