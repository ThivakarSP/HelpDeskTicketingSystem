import React, { useState, useEffect } from 'react';

const PriorityManagement = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPriority, setEditingPriority] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchPriorities();
  }, []);

  const fetchPriorities = async () => {
    try {
      const response = await fetch('/api/priorities');
      if (!response.ok) {
        throw new Error('Failed to fetch priorities');
      }
      const data = await response.json();
      setPriorities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPriority ? `/api/priorities/${editingPriority.id}` : '/api/priorities';
      const method = editingPriority ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save priority');
      }

      await fetchPriorities();
      setShowForm(false);
      setEditingPriority(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (priority) => {
    setEditingPriority(priority);
    setFormData({
      name: priority.name,
      description: priority.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this priority?')) {
      try {
        const response = await fetch(`/api/priorities/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete priority');
        }

        await fetchPriorities();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPriority(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) return <div className="container">Loading priorities...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Priority Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add Priority
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>{editingPriority ? 'Edit Priority' : 'Add New Priority'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">
                {editingPriority ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        {priorities.length === 0 ? (
          <div className="card">
            <p>No priorities found. Create the first priority to get started.</p>
          </div>
        ) : (
          priorities.map(priority => (
            <div key={priority.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{priority.name}</h3>
                  {priority.description && (
                    <p style={{ margin: '0', color: '#666' }}>{priority.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(priority)}
                    disabled={showForm}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(priority.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityManagement;
