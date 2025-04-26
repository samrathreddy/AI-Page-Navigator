import React, { useState, useEffect } from 'react';

// Define product type
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  numericPrice: number; // Used for sorting
  category: string;
  image: string;
}

const ProductsPage: React.FC = () => {
  // Product data with categories and numeric prices for sorting
  const allProducts: Product[] = [
    {
      id: 1,
      name: 'Voice Navigator Pro',
      description: 'Advanced speech recognition for enterprise applications',
      price: '$999',
      numericPrice: 999,
      category: 'Enterprise',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Speech AI SDK',
      description: 'Developer toolkit for building voice-enabled applications',
      price: '$499',
      numericPrice: 499,
      category: 'Developer',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Voice Assistant Plugin',
      description: 'Add voice navigation to your existing website',
      price: '$299',
      numericPrice: 299,
      category: 'Integration',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 4,
      name: 'Multilingual Voice Pack',
      description: 'Support for 20+ languages and dialects',
      price: '$199',
      numericPrice: 199,
      category: 'Add-on',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 5,
      name: 'Voice Analytics Pro',
      description: 'Advanced analytics for voice interactions',
      price: '$399',
      numericPrice: 399,
      category: 'Enterprise',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 6,
      name: 'Voice UX Testing Tool',
      description: 'Test your voice user experience with real users',
      price: '$599',
      numericPrice: 599,
      category: 'Developer',
      image: 'https://via.placeholder.com/150'
    }
  ];

  // State for filters and sorting
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Categories for filter options
  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];

  // Effect to apply filters and sorting
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (priceSort !== 'none') {
      filteredProducts.sort((a, b) => {
        return priceSort === 'asc' 
          ? a.numericPrice - b.numericPrice 
          : b.numericPrice - a.numericPrice;
      });
    }
    
    setProducts(filteredProducts);
  }, [categoryFilter, priceSort, searchQuery]);

  // Effect to update active filters when filter states change
  useEffect(() => {
    const newActiveFilters = [];
    
    // Add category filter
    if (categoryFilter !== 'All') {
      newActiveFilters.push(`Category: ${categoryFilter}`);
    }
    
    // Add price sort
    if (priceSort === 'asc') {
      newActiveFilters.push('Price: Low to High');
    } else if (priceSort === 'desc') {
      newActiveFilters.push('Price: High to Low');
    }
    
    // Add search query
    if (searchQuery) {
      newActiveFilters.push(`Search: "${searchQuery}"`);
    }
    
    setActiveFilters(newActiveFilters);
  }, [categoryFilter, priceSort, searchQuery]);

  // Handler for filters applied by AI or UI
  const applyFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'category':
        setCategoryFilter(value);
        break;
      case 'price':
        if (value === 'low-to-high') {
          setPriceSort('asc');
        } else if (value === 'high-to-low') {
          setPriceSort('desc');
        } else {
          setPriceSort('none');
        }
        break;
      case 'search':
        setSearchQuery(value);
        break;
      case 'clear':
        setCategoryFilter('All');
        setPriceSort('none');
        setSearchQuery('');
        break;
    }
  };

  // Remove a specific filter 
  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith('Category:')) {
      applyFilter('category', 'All');
    } else if (filterToRemove.startsWith('Price:')) {
      applyFilter('price', 'none');
    } else if (filterToRemove.startsWith('Search:')) {
      applyFilter('search', '');
    }
  };

  // AI commands this component can handle
  window.productCommands = {
    applyFilter: applyFilter,
    getCategories: () => categories,
    getProducts: () => products,
    getAllProducts: () => allProducts
  };

  return (
    <div className="page products-page">
      <h1>Our Products</h1>
      <p>Explore our range of voice navigation solutions. Try saying:</p>
      <ul className="voice-commands-list">
        <li>"Show me products sorted by price low to high"</li>
        <li>"Filter products by Enterprise category"</li>
        <li>"Search for voice recognition products"</li>
        <li>"Clear all filters"</li>
      </ul>
      
      <div className="filters-container">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={categoryFilter}
            onChange={(e) => applyFilter('category', e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort by Price:</label>
          <select 
            value={priceSort}
            onChange={(e) => applyFilter('price', e.target.value as any)}
          >
            <option value="none">No sorting</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Search:</label>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => applyFilter('search', e.target.value)}
            placeholder="Search products..."
          />
        </div>
        
        <button 
          className="clear-filters-btn"
          onClick={() => applyFilter('clear', '')}
        >
          Clear All
        </button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span>Active Filters:</span>
          {activeFilters.map((filter, index) => (
            <span key={index} className="filter-tag" onClick={() => removeFilter(filter)}>
              {filter} <span className="filter-remove">×</span>
            </span>
          ))}
          {activeFilters.length > 1 && (
            <span 
              className="filter-tag clear-all-tag" 
              onClick={() => applyFilter('clear', '')}
            >
              Clear All
            </span>
          )}
        </div>
      )}
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="category-tag">{product.category}</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="price">{product.price}</div>
              <button className="view-details-btn">View Details</button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No products match your filters. Try different criteria or clear filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 