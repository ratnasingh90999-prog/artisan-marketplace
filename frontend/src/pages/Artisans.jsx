import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArtisans } from '../api/artisans.js';

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtisans()
      .then((data) => setArtisans(data))
      .catch(() => setError('Unable to load artisans.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="artisans-page container">
      <div className="section-header">
        <div>
          <p className="eyebrow">Artisan gallery</p>
          <h2>Meet the makers with stories worth sharing</h2>
        </div>
      </div>

      {loading ? (
        <div className="status-card">Loading artisans…</div>
      ) : error ? (
        <div className="status-card status-error">{error}</div>
      ) : (
        <div className="grid-artisans page-grid">
          {artisans.map((artisan) => (
            <Link key={artisan._id} to={`/artisan/${artisan._id}`} className="artisan-card">
              <div className="artisan-avatar">{artisan.name?.slice(0, 2).toUpperCase()}</div>
              <div>
                <h3>{artisan.name}</h3>
                <p>{artisan.craftCategory || 'Artisan'}</p>
              </div>
              <p>{artisan.story ? `${artisan.story.slice(0, 90)}...` : 'Crafting authentic goods with care.'}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
