import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProduct } from '../api/products.js';
import { getArtisans } from '../api/artisans.js';
import { formatPrice, truncate } from '../lib/utils.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getProducts(), getArtisans()])
      .then(([productData, artisanData]) => {
        setProducts(productData.slice(0, 9));
        setArtisans(artisanData.slice(0, 4));
      })
      .catch(() => setError('Unable to load marketplace content.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const results = await getProducts({ keyword: search });
      setProducts(results.slice(0, 9));
    } catch {
      setError('Search failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home-page container">
      <div className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Handmade, local, meaningful</p>
          <h1>Discover earth-born collections from artisans who tell a story with every piece.</h1>
          <p className="hero-text">A warm marketplace built for makers, designed for the people who love beautiful craft.</p>
          <form onSubmit={handleSearch} className="search-form">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pottery, woodwork, jewelry..."
              className="search-input"
            />
            <button className="button-primary">Search</button>
          </form>
        </div>
        <div className="hero-image" />
      </div>

      <div className="section-header">
        <div>
          <p className="eyebrow">Featured collection</p>
          <h2>Shop handpicked artisan pieces</h2>
        </div>
        <Link to="/artisans" className="link-secondary">Browse all artisans</Link>
      </div>

      {loading ? (
        <div className="status-card">Loading products…</div>
      ) : error ? (
        <div className="status-card status-error">{error}</div>
      ) : (
        <div className="grid-cards">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-body">
                <p className="product-chip">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{truncate(product.description || product.story, 100)}</p>
                <div className="product-footer">
                  <span>{formatPrice(product.price)}</span>
                  <span>{product.rating?.toFixed(1) || '4.5'} ★</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="artisan-highlight">
        <div>
          <p className="eyebrow">Trusted makers</p>
          <h2>Meet the artisans shaping our market</h2>
        </div>
        <div className="grid-artisans">
          {artisans.map((artisan) => (
            <Link key={artisan._id} to={`/artisan/${artisan._id}`} className="artisan-card">
              <div className="artisan-avatar">{artisan.name?.slice(0, 2).toUpperCase()}</div>
              <div>
                <h3>{artisan.name}</h3>
                <p>{artisan.craftCategory || 'Artisan'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
