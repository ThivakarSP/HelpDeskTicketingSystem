import React, { useState } from 'react';
import './App.css';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';
import TicketDetails from './components/TicketDetails';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav style={{background: 'var(--accent)', padding: '1rem 0', marginBottom: 24}}>
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{color: '#fff', fontWeight: 600, fontSize: '1.3rem', letterSpacing: '0.08em'}}>Help Desk Ticketing System</span>
          <div>
            <Link to="/" className="btn-secondary" style={{marginRight: 12}}>All Tickets</Link>
            <Link to="/create" className="btn-primary">Create Ticket</Link>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<TicketListWrapper />} />
          <Route path="/create" element={<CreateTicketWrapper />} />
          <Route path="/tickets/:id" element={<TicketDetailsWrapper />} />
        </Routes>
      </main>
    </Router>
  );
}

//--- Routing-aware wrappers to handle navigation between details/list ---//
function TicketListWrapper() {
  const navigate = useNavigate();
  return <TicketList onViewDetails={id => navigate(`/tickets/${id}`)} />;
}

function CreateTicketWrapper() {
  const navigate = useNavigate();
  return (
    <CreateTicket onSuccess={ticket => ticket?.id && navigate(`/tickets/${ticket.id}`)} />
  );
}

function TicketDetailsWrapper() {
  const { id } = useLocation().pathname.match(/\d+/) || { id: undefined };
  // react-router-dom v6: useParams hook, but let's parse from path for robustness
  const ticketId = parseInt(id || window.location.pathname.split('/').pop());
  const navigate = useNavigate();
  return <TicketDetails ticketId={ticketId} onStatusUpdate={() => {}} />;
}

export default App;
