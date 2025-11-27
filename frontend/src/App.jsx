import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholders for other pages
import Clients from './pages/Clients';
import Products from './pages/Products';
import Services from './pages/Services';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Financial from './pages/Financial';
import CompanySettings from './pages/CompanySettings';
import UserProfile from './pages/UserProfile';
import Team from './pages/Team';

import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/clients" element={
                <PrivateRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/products" element={
                <PrivateRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/services" element={
                <PrivateRoute>
                  <Layout>
                    <Services />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/orders" element={
                <PrivateRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/orders/:id" element={
                <PrivateRoute>
                  <Layout>
                    <OrderDetails />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/financial" element={
                <PrivateRoute>
                  <Layout>
                    <Financial />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/settings/company" element={
                <PrivateRoute>
                  <Layout>
                    <CompanySettings />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/settings/profile" element={
                <PrivateRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/team" element={
                <PrivateRoute>
                  <Layout>
                    <Team />
                  </Layout>
                </PrivateRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
