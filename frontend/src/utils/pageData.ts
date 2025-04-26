// This file contains the metadata about all pages in the application
// This information is used by the speech navigation system to identify which page to navigate to

export interface PageInfo {
  id: string;
  name: string;
  path: string;
  keywords: string[];
  description: string;
}

const pages: PageInfo[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    keywords: ['home', 'main', 'landing', 'homepage', 'start', 'beginning', 'welcome'],
    description: 'The main landing page of the application'
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    keywords: ['about', 'information', 'company', 'who we are', 'mission', 'team', 'organization', 'about us'],
    description: 'Information about our company, mission, and team'
  },
  {
    id: 'products',
    name: 'Products',
    path: '/products',
    keywords: ['products', 'services', 'items', 'offerings', 'solutions', 'buy', 'purchase', 'catalog', 'shop'],
    description: 'Browse our products and services'
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    keywords: ['contact', 'email', 'phone', 'message', 'support', 'help', 'reach out', 'contact us', 'get in touch'],
    description: 'Contact information and a form to reach us'
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    keywords: ['settings', 'preferences', 'options', 'configure', 'setup', 'customize', 'personalize', 'account'],
    description: 'Configure your application settings and preferences'
  }
];

export default pages; 