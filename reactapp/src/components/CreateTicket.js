import React, { useState, useEffect } from 'react';

const CreateTicket = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priorityId: '',
    categoryId: ''
  });
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const load = async () => {
      let pJson = [];
      let cJson = [];
      try {
        const pRes = await fetch('http://localhost:8080/api/lookups/priorities');
        if (!pRes.ok) throw new Error(`priorities status ${pRes.status}`);
        pJson = await pRes.json();
        setPriorities(pJson);
      } catch (e) {
        console.error('Priority fetch failed', e);
        setError(prev => prev || `Failed to load priorities (${e.message})`);
      }
      try {
        const cRes = await fetch('http://localhost:8080/api/lookups/categories');
        if (!cRes.ok) throw new Error(`categories status ${cRes.status}`);
        cJson = await cRes.json();
        setCategories(cJson);
      } catch (e) {
        console.error('Category fetch failed', e);
        setError(prev => prev || `Failed to load categories (${e.message})`);
      }
      setFormData(fd => ({
        ...fd,
        priorityId: pJson[0]?.id || fd.priorityId,
        categoryId: cJson[0]?.id || fd.categoryId
      }));
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Creating ticket for user:', currentUser);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        priorityId: formData.priorityId ? Number(formData.priorityId) : undefined,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        submitterId: currentUser.id ? Number(currentUser.id) : 1
      };
      
      console.log('Ticket payload:', payload);

      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = 'Failed to create ticket';
        try {
          const errTxt = await response.text();
          if (errTxt) {
            const errJson = JSON.parse(errTxt);
            errorMsg = errJson.error || errJson.message || errorMsg;
          }
        } catch (_) { /* ignore parse issues */ }
        throw new Error(errorMsg);
      }

      // Safe parse success body
      let ticket;
      try {
        const txt = await response.text();
        ticket = txt ? JSON.parse(txt) : null;
      } catch (_) {
        ticket = null;
      }

      // Show success message
      setSuccess({
        message: `Ticket #${ticket?.id || 'Unknown'} created successfully!`,
        ticketId: ticket?.id
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priorityId: priorities[0]?.id || '',
        categoryId: categories[0]?.id || ''
      });

      // Call success callback after a delay to show the message
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(ticket);
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create New Ticket</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="255"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength="1000"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="priorityId">Priority *</label>
            <select
              id="priorityId"
              name="priorityId"
              value={formData.priorityId}
              onChange={handleChange}
              required
              disabled={!priorities.length}
            >
              {priorities.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

            <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={!categories.length}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {success && (
            <div style={{ 
              color: 'var(--success, #28a745)', 
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              ✅ {success.message}
              <br />
              <small>You will be redirected to your tickets shortly...</small>
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || success}
          >
            {loading ? 'Creating...' : success ? 'Ticket Created!' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
