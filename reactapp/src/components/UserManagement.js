import React, { useEffect, useMemo, useState } from 'react';

const ROLES = ['ADMIN', 'AGENT', 'EMPLOYEE'];

const initialForm = {
  name: '',
  email: '',
  role: 'EMPLOYEE',
  password: '' // only required on create; optional on edit
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [searchUserId, setSearchUserId] = useState('');
  const [searchError, setSearchError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [roleStats, setRoleStats] = useState(null);
  const [roleStatsLoading, setRoleStatsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoleStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  }, [users]);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoleStats() {
    setRoleStatsLoading(true);
    try {
      const res = await fetch('/api/users/role-stats');
      if (!res.ok) throw new Error('Failed to fetch role stats');
      const data = await res.json();
      setRoleStats(data);
    } catch (e) {
      console.error('Failed to fetch role stats:', e);
      // Set fallback data
      setRoleStats({
        roleCounts: { ADMIN: 0, AGENT: 0, EMPLOYEE: 0 },
        totalUsers: users.length
      });
    } finally {
      setRoleStatsLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function startCreate() {
    setEditingUser(null);
    setFormData(initialForm);
    setShowForm(true);
  }

  function startEdit(user) {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'EMPLOYEE',
      password: ''
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingUser(null);
    setFormData(initialForm);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const creating = !editingUser;
      const url = creating ? '/api/users' : `/api/users/${editingUser.id}`;
      const method = creating ? 'POST' : 'PUT';

      const payload = {
        name: formData.name?.trim(),
        email: formData.email?.trim(),
        role: formData.role
      };
      if (creating) {
        if (!formData.password) throw new Error('Password is required for new users');
        payload.password = formData.password;
      } else if (formData.password) {
        payload.password = formData.password; // change only if provided
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const msg = creating ? 'Failed to create user' : 'Failed to update user';
        throw new Error(msg);
      }

      await fetchUsers();
      cancelForm();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  }

  const handleSearchUser = async () => {
    if (!searchUserId.trim()) {
      setSearchError('Please enter a user ID');
      return;
    }
    
    setSearchError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/users/search/${searchUserId.trim()}`);
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError('User not found');
          setSearchResult(null);
        } else {
          setSearchError('Failed to search user');
          setSearchResult(null);
        }
        setIsSearchMode(true);
        setLoading(false);
        return;
      }
      const user = await response.json();
      setSearchResult(user);
      setIsSearchMode(true);
      setSearchError(null);
    } catch (error) {
      setSearchError('Error searching for user');
      setSearchResult(null);
      setIsSearchMode(true);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchUserId('');
    setSearchError(null);
    setSearchResult(null);
    setIsSearchMode(false);
  };

  if (loading) return <div className="container">Loading users...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>User Management</h1>
        <button className="btn-primary" onClick={startCreate} disabled={showForm}>Add User</button>
      </div>

      {/* User Role Statistics */}
      {roleStats && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>User Role Distribution</h3>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(roleStats.roleCounts || {}).map(([role, count]) => (
              <div key={role} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: role === 'ADMIN' ? '#f44336' : role === 'AGENT' ? '#2196f3' : '#4caf50' 
                }}>
                  {count}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{role}S</div>
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9c27b0' }}>
                {roleStats.totalUsers || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>TOTAL</div>
            </div>
          </div>
          {roleStatsLoading && (
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
              Loading role statistics...
            </div>
          )}
        </div>
      )}

      {/* Search by User ID */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>Search User by ID</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <input
            type="number"
            placeholder="Enter User ID"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
          />
          <button 
            onClick={handleSearchUser}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Search
          </button>
          {isSearchMode && (
            <button 
              onClick={clearSearch}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Show All
            </button>
          )}
        </div>
        {searchError && (
          <div style={{ color: '#dc3545', marginTop: '0.5rem' }}>
            {searchError}
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="name">Name *</label>
                <input id="name" name="name" value={formData.name} onChange={onChange} required style={{ width: '100%' }} />
              </div>
              <div>
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={onChange} required style={{ width: '100%' }} />
              </div>
              <div>
                <label htmlFor="role">Role *</label>
                <select id="role" name="role" value={formData.role} onChange={onChange} required style={{ width: '100%' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="password">{editingUser ? 'Password (leave blank to keep)' : 'Password *'}</label>
                <input id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder={editingUser ? '•••••••• (unchanged if left blank)' : ''} style={{ width: '100%' }} required={!editingUser} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary">{editingUser ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div>
        {(isSearchMode ? searchResult ? [searchResult] : [] : sortedUsers).length === 0 ? (
          <div className="card"><p>{isSearchMode ? 'No user found with the specified ID.' : 'No users found. Create the first user to get started.'}</p></div>
        ) : (
          (isSearchMode ? [searchResult] : sortedUsers).map(u => (
            <div key={u.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{u.name} <span style={{ fontWeight: 400, color: '#666', fontSize: '0.9rem' }}>({u.role})</span></h3>
                  <div style={{ color: '#555' }}>{u.email}</div>
                  {u.phoneNumber && <div style={{ color: '#777', fontSize: '0.9rem' }}>Phone: {u.phoneNumber}</div>}
                  {u.createdAt && <div style={{ color: '#999', fontSize: '0.85rem', marginTop: 4 }}>Joined: {new Date(u.createdAt).toLocaleString()}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button className="btn-secondary" onClick={() => startEdit(u)} disabled={showForm}>Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(u.id)} style={{ backgroundColor: '#dc3545', color: '#fff' }}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;
