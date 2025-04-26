import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import pages from '../utils/pageData';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="logo-text">Speech Navigator</span>
        </Link>
      </div>
      
      <div className="nav-links">
        {pages.map(page => (
          <Link 
            key={page.id}
            to={page.path}
            className={location.pathname === page.path ? 'active' : ''}
          >
            {page.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar; 