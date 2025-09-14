import React, { useState, useEffect } from 'react';

const KnowledgeBaseView = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/knowledge-base');
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      setArticles(data);
      // Store articles in localStorage for consistency
      localStorage.setItem('knowledgeBaseArticles', JSON.stringify(data));
    } catch (err) {
      console.error('Fetch articles error:', err);
      // Always use fresh demo data for now
      const demoArticles = getDemoArticles();
      setArticles(demoArticles);
      localStorage.setItem('knowledgeBaseArticles', JSON.stringify(demoArticles));
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
      } else {
        throw new Error('Categories API not available');
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Always use fresh demo categories for now
      const demoCategories = getDemoCategories();
      setCategories(demoCategories);
      localStorage.setItem('categories', JSON.stringify(demoCategories));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchArticles();
      await fetchCategories();
    };
    fetchData();

    // Listen for localStorage changes (when admin updates categories/articles)
    const handleStorageChange = (e) => {
      console.log('Storage change detected:', e.key, e.newValue);
      if (e.key === 'categories' && e.newValue) {
        const updatedCategories = JSON.parse(e.newValue);
        console.log('Updating categories from storage:', updatedCategories);
        setCategories(updatedCategories);
      } else if (e.key === 'knowledgeBaseArticles' && e.newValue) {
        const updatedArticles = JSON.parse(e.newValue);
        console.log('Updating articles from storage:', updatedArticles);
        setArticles(updatedArticles);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for localStorage changes on focus (same tab updates)
    const handleFocus = () => {
      console.log('Window focus - checking for localStorage updates');
      const storedCategories = localStorage.getItem('categories');
      const storedArticles = localStorage.getItem('knowledgeBaseArticles');
      
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        console.log('Found stored categories on focus:', parsedCategories);
        setCategories(parsedCategories);
      }
      
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        console.log('Found stored articles on focus:', parsedArticles);
        setArticles(parsedArticles);
      }
    };

    // Check for changes every 2 seconds as a fallback
    const intervalId = setInterval(() => {
      const storedCategories = localStorage.getItem('categories');
      const storedArticles = localStorage.getItem('knowledgeBaseArticles');
      
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        if (JSON.stringify(parsedCategories) !== JSON.stringify(categories)) {
          console.log('Categories changed detected via interval:', parsedCategories);
          setCategories(parsedCategories);
        }
      }
      
      if (storedArticles) {
        const parsedArticles = JSON.parse(storedArticles);
        if (JSON.stringify(parsedArticles) !== JSON.stringify(articles)) {
          console.log('Articles changed detected via interval:', parsedArticles);
          setArticles(parsedArticles);
        }
      }
    }, 2000);

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDemoArticles = () => [
    {
      id: 1,
      title: 'How to Reset Your Password',
      content: 'To reset your password:\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link in the email to create a new password',
      categoryId: 1,
      category: { id: 1, name: 'Account Management' },
      createdAt: '2024-01-01T10:00:00'
    },
    {
      id: 2,
      title: 'Creating a Support Ticket',
      content: 'To create a support ticket:\n1. Click on "Create Ticket" in the navigation\n2. Fill in the required fields:\n   - Title: Brief description of the issue\n   - Description: Detailed explanation\n   - Priority: Select appropriate priority level\n   - Category: Choose the relevant category\n3. Click "Submit" to create the ticket\n4. You will receive a confirmation email with your ticket number',
      categoryId: 2,
      category: { id: 2, name: 'Getting Started' },
      createdAt: '2024-01-02T10:00:00'
    },
    {
      id: 3,
      title: 'Understanding Ticket Priorities',
      content: 'Ticket priorities help us respond to your requests appropriately:\n\n• High Priority: Critical issues affecting business operations\n• Medium Priority: Important issues that need attention soon\n• Low Priority: General questions or minor issues\n\nPlease select the appropriate priority to ensure timely response to your request.',
      categoryId: 2,
      category: { id: 2, name: 'Getting Started' },
      createdAt: '2024-01-03T10:00:00'
    },
    {
      id: 4,
      title: 'Browser Compatibility',
      content: 'Our application works best with modern browsers:\n\nRecommended Browsers:\n• Google Chrome (latest version)\n• Mozilla Firefox (latest version)\n• Microsoft Edge (latest version)\n• Safari (latest version)\n\nIf you experience issues, please try:\n1. Clearing your browser cache\n2. Disabling browser extensions\n3. Using an incognito/private window',
      categoryId: 3,
      category: { id: 3, name: 'Technical Support' },
      createdAt: '2024-01-04T10:00:00'
    },
    {
      id: 5,
      title: 'Two-Factor Authentication Setup',
      content: 'For enhanced security, we recommend enabling two-factor authentication:\n\n1. Go to Account Settings\n2. Click on "Security" tab\n3. Enable "Two-Factor Authentication"\n4. Download an authenticator app (Google Authenticator, Authy, etc.)\n5. Scan the QR code with your app\n6. Enter the verification code to complete setup\n\nYour account will now require both your password and a code from your authenticator app to sign in.',
      categoryId: 1,
      category: { id: 1, name: 'Account Management' },
      createdAt: '2024-01-05T10:00:00'
    },
    {
      id: 6,
      title: 'Network Connectivity Issues',
      content: 'If you\'re experiencing network connectivity issues:\n\n1. Check your internet connection\n2. Try refreshing the page\n3. Clear your browser cache and cookies\n4. Disable VPN if you\'re using one\n5. Check if our service status page shows any outages\n6. Try accessing from a different network\n\nIf the problem persists, please contact our technical support team.',
      categoryId: 3,
      category: { id: 3, name: 'Technical Support' },
      createdAt: '2024-01-06T10:00:00'
    }
  ];

  const getDemoCategories = () => [
    { id: 1, name: 'Account Management' },
    { id: 2, name: 'Getting Started' },
    { id: 3, name: 'Technical Support' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filtering - check multiple possible category field structures
    let matchesCategory = selectedCategory === '';
    if (!matchesCategory && selectedCategory) {
      const categoryIdToCheck = article.categoryId || article.category?.id;
      const categoryNameToCheck = article.category?.name;
      
      matchesCategory = categoryIdToCheck?.toString() === selectedCategory ||
                       categoryNameToCheck === selectedCategory ||
                       // Also check if selectedCategory matches category name from the categories list
                       categories.find(cat => cat.id.toString() === selectedCategory)?.name === categoryNameToCheck;
    }
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not specified';
    return date.toLocaleDateString();
  };

  if (loading) return <div className="container">Loading knowledge base...</div>;

  if (selectedArticle) {
    return (
      <div className="container">
        <button 
          onClick={() => setSelectedArticle(null)}
          style={{ 
            marginBottom: '1rem', 
            background: 'none', 
            border: '1px solid #ccc', 
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Knowledge Base
        </button>
        
        <div className="card">
          <h1>{selectedArticle.title}</h1>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#666', 
            marginBottom: '1rem',
            borderBottom: '1px solid #eee',
            paddingBottom: '0.5rem'
          }}>
            Category: {selectedArticle.category?.name || 'Uncategorized'} • 
            Published: {formatDate(selectedArticle.createdAt)}
          </div>
          <div style={{ 
            lineHeight: '1.6', 
            whiteSpace: 'pre-line',
            fontSize: '1rem'
          }}>
            {selectedArticle.content}
          </div>
        </div>
      </div>
    );
  }

  const refreshData = async () => {
    setLoading(true);
    await fetchArticles();
    await fetchCategories();
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: '#1f2937', fontWeight: '700' }}>Knowledge Base</h1>
        <button
          onClick={refreshData}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          🔄 Refresh
        </button>
      </div>
      <p style={{ color: '#374151', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: '500' }}>
        Find answers to frequently asked questions and learn how to use our system.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '1rem', 
        marginBottom: '2rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          <option value="">All Categories ({articles.length})</option>
          {categories.map(category => {
            const articleCount = articles.filter(article => 
              article.categoryId?.toString() === category.id.toString() ||
              article.category?.id?.toString() === category.id.toString()
            ).length;
            return (
              <option key={category.id} value={category.id}>
                {category.name} ({articleCount})
              </option>
            );
          })}
        </select>
      </div>

      <div style={{ marginBottom: '1rem', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>
        Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
        {selectedCategory && ` in ${categories.find(cat => cat.id.toString() === selectedCategory)?.name}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="card">
          <p style={{ color: '#374151', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
            No articles found matching your search criteria.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="card" 
              style={{ 
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                ':hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
              }}
              onClick={() => setSelectedArticle(article)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontWeight: '600' }}>
                    {article.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 1rem 0', 
                    color: '#374151',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {article.content}
                  </p>
                  <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                    <span style={{ 
                      backgroundColor: '#e5e7eb', 
                      color: '#1f2937',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px',
                      marginRight: '0.5rem',
                      fontWeight: '500'
                    }}>
                      {article.category?.name || 'Uncategorized'}
                    </span>
                    • Published: {formatDate(article.createdAt)}
                  </div>
                </div>
                <div style={{ marginLeft: '1rem', color: '#1e40af', fontWeight: 'bold' }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseView;