import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import SchedulePage from './pages/SchedulePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyForm from './pages/admin/AdminPropertyForm';
import AdminClients from './pages/admin/AdminClients';
import AdminContent from './pages/admin/AdminContent';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/*" element={<PublicLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/:id" element={<PropertyDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="schedule" element={<SchedulePage />} />
          </Route>
          
          {/* Admin Login Route (Public) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Panel Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<AdminPropertyForm />} />
              <Route path="properties/edit/:id" element={<AdminPropertyForm />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="content" element={<AdminContent />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;