import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Artisans from './pages/Artisans.jsx';
import ArtisanDetail from './pages/ArtisanDetail.jsx';
import CartPage from './pages/Cart.jsx';
import AuthPage from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisan/:id" element={<ArtisanDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<AuthPage initialView="login" />} />
          <Route path="/register" element={<AuthPage initialView="register" />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route
            path="*"
            element={
              <div className="not-found-card">
                <h1>Page Not Found</h1>
                <p>The artisan experience you were looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>Artisan Marketplace — Crafted for local makers and curious collectors.</p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}
