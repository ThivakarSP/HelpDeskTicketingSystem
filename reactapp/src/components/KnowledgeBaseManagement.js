import React, { useState, useEffect } from 'react';

const KnowledgeBaseManagement = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/knowledge-base');
      if (!response.ok) {
        throw new Error(`Backend not available (status ${response.status})`);
      }
      const data = await response.json();
      setArticles(data);
      // Store articles in localStorage for consistency
      localStorage.setItem('knowledgeBaseArticles', JSON.stringify(data));
    } catch (err) {
      console.error('Fetch articles error:', err);
      // Fallback to localStorage for demo mode
      const storedArticles = localStorage.getItem('knowledgeBaseArticles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      } else {
        // Set default demo articles
        const demoArticles = [
          {
            id: 1,
            title: 'How to reset your password',
            content: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email.',
            category: { id: 1, name: 'Account Management' },
            categoryId: 1
          },
          {
            id: 2,
            title: 'How to create a support ticket',
            content: 'To create a support ticket, navigate to the "Create Ticket" page, fill in the required information including title, description, and priority level.',
            category: { id: 2, name: 'General Help' },
            categoryId: 2
          }
        ];
        setArticles(demoArticles);
        localStorage.setItem('knowledgeBaseArticles', JSON.stringify(demoArticles));
      }
      setError('Backend not available - using demo mode');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/lookups/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // Store categories in localStorage for consistency
        localStorage.setItem('categories', JSON.stringify(data));
        console.log('Fetched categories from API and stored in localStorage:', data);
      } else {
        throw new Error('Categories API not available');
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback to localStorage for demo mode
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Set default demo categories
        const demoCategories = [
          { id: 1, name: 'Account Management' },
          { id: 2, name: 'General Help' },
          { id: 3, name: 'Technical Issues' },
          { id: 4, name: 'Billing' }
        ];
        setCategories(demoCategories);
        localStorage.setItem('categories', JSON.stringify(demoCategories));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingArticle ? `http://localhost:8080/api/knowledge-base/${editingArticle.id}` : 'http://localhost:8080/api/knowledge-base';
      const method = editingArticle ? 'PUT' : 'POST';
      
      const payload = {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId || null
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Backend not available');
      }

      await fetchArticles();
    } catch (err) {
      console.error('API error, using localStorage:', err);
      // Fallback to localStorage
      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));
      
      if (editingArticle) {
        // Update existing article
        const updatedArticles = articles.map(article => 
          article.id === editingArticle.id 
            ? {
                ...article,
                title: formData.title,
                content: formData.content,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                category: selectedCategory || null
              }
            : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('knowledgeBaseArticles', JSON.stringify(updatedArticles));
        console.log('Updated articles in localStorage:', updatedArticles);
      } else {
        // Create new article
        const newArticle = {
          id: Date.now(),
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
          category: selectedCategory || null
        };
        const updatedArticles = [...articles, newArticle];
        setArticles(updatedArticles);
        localStorage.setItem('knowledgeBaseArticles', JSON.stringify(updatedArticles));
        console.log('Created new article in localStorage:', updatedArticles);
      }
    }

    setShowForm(false);
    setEditingArticle(null);
    setFormData({ title: '', content: '', categoryId: '' });
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId ? article.categoryId.toString() : (article.category ? article.category.id.toString() : '')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/knowledge-base/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Backend not available');
        }

        await fetchArticles();
      } catch (err) {
        console.error('API error, using localStorage:', err);
        // Fallback to localStorage
        const updatedArticles = articles.filter(article => article.id !== id);
        setArticles(updatedArticles);
        localStorage.setItem('knowledgeBaseArticles', JSON.stringify(updatedArticles));
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
    setEditingArticle(null);
    setFormData({ title: '', content: '', categoryId: '' });
  };

  if (loading) return <div className="container">Loading knowledge base...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Knowledge Base Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add Article
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>{editingArticle ? 'Edit Article' : 'Add New Article'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="">Select a category (optional)</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">
                {editingArticle ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        {articles.length === 0 ? (
          <div className="card">
            <p>No articles found. Create the first article to get started.</p>
          </div>
        ) : (
          articles.map(article => (
            <div key={article.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{article.title}</h3>
                  {article.category && (
                    <span style={{ 
                      backgroundColor: '#e9ecef', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>
                      {article.category.name}
                    </span>
                  )}
                  <p style={{ 
                    margin: '0.5rem 0 0 0', 
                    color: '#666',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.content}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(article)}
                    disabled={showForm}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(article.id)}
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

export default KnowledgeBaseManagement;