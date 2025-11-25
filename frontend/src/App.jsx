import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Placeholders for other pages
import Clients from './pages/Clients';
import Products from './pages/Products';
import Services from './pages/Services';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Financial from './pages/Financial';

import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/financial" element={<Financial />} />
            </Routes>
          </Layout>
        </Router>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
