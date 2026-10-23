import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CategoryProductsPage from './pages/CategoryProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CustomOrdersPage from './pages/CustomOrdersPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AnnouncementBar from './components/AnnouncementBar.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnnouncementBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:categorySlug" element={<CategoryProductsPage />} />
        <Route path="/products/:categorySlug/:productSlug" element={<ProductDetailsPage />} />
        <Route path="/custom-orders" element={<CustomOrdersPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
