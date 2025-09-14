import React from 'react';
import UserTicketList from './UserTicketList';
import CreateTicket from './CreateTicket';
import KnowledgeBaseView from './KnowledgeBaseView';

const UserPortal = () => {
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [user, setUser] = React.useState(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleTicketCreated = (ticket) => {
    // Force refresh of ticket lists by updating key
    setRefreshKey(prev => prev + 1);
    // Navigate to my tickets to show the newly created ticket
    setCurrentView('my-tickets');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'my-tickets':
        return <UserTicketList userTicketsOnly={true} key={`my-tickets-${refreshKey}`} />;
      case 'create-ticket':
        return <CreateTicket onSuccess={handleTicketCreated} />;
      case 'all-tickets':
        return <UserTicketList key={`all-tickets-${refreshKey}`} />;
      case 'knowledge-base':
        return <KnowledgeBaseView />;
      default:
        return (
          <div className="container">
            <h1>User Dashboard</h1>
            <div className="card">
              <h2>Welcome, {user?.username || 'User'}!</h2>
              <p>Manage your support tickets and create new ones.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('my-tickets')}>
                  <h3>My Tickets</h3>
                  <p>View your submitted tickets</p>
                </div>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('create-ticket')}>
                  <h3>Create Ticket</h3>
                  <p>Submit a new support request</p>
                </div>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('all-tickets')}>
                  <h3>All Tickets</h3>
                  <p>Browse all support tickets</p>
                </div>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('knowledge-base')}>
                  <h3>Knowledge Base</h3>
                  <p>Browse help articles and FAQs</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <nav style={{ 
        backgroundColor: '#3498db', 
        color: 'white', 
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>User Portal</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{ background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('my-tickets')}
            style={{ background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            My Tickets
          </button>
          <button 
            onClick={() => setCurrentView('create-ticket')}
            style={{ background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            Create Ticket
          </button>
          <button 
            onClick={() => setCurrentView('knowledge-base')}
            style={{ background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            Knowledge Base
          </button>
          <button 
            onClick={handleLogout}
            style={{ background: '#e74c3c', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      </nav>
      {renderContent()}
    </div>
  );
};

export default UserPortal;