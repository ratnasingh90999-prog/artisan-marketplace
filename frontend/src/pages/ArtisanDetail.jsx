import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtisan, getArtisanProducts } from '../api/artisans.js';
import { formatPrice } from '../lib/utils.js';

export default function ArtisanDetail() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getArtisan(id), getArtisanProducts(id)])
      .then(([artisanData, productData]) => {
        setArtisan(artisanData);
        setProducts(productData);
      })
      .catch(() => setError('Unable to load artisan details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="status-card">Loading artisan profile…</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <section className="artisan-detail-page container">
      <div className="artisan-banner">
        <div>
          <p className="eyebrow">{artisan.craftCategory || 'Artisan'}</p>
          <h1>{artisan.name}</h1>
          <p>{artisan.story || 'An artisan creating beautiful handcrafted pieces.'}</p>
        </div>
        <div className="artisan-stat-card">
          <p>Village</p>
          <h3>{artisan.village || 'Unknown'}</h3>
          <p>{artisan.rating?.toFixed(1) || '4.8'} ★ rating</p>
        </div>
      </div>

      <div className="section-header">
        <div>
          <p className="eyebrow">Artisan collection</p>
          <h2>Products crafted by {artisan.name}</h2>
        </div>
      </div>

      <div className="page-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description || 'A timeless handmade item.'}</p>
            <p className="product-price">{formatPrice(product.price)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
