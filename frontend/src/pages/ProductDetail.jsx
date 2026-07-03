import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, addReview } from '../api/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice, formatRelativeTime } from '../lib/utils.js';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews || []);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setMessage('Added to cart');
    setTimeout(() => setMessage(''), 3000);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      setError('Please log in to submit a review.');
      return;
    }

    try {
      await addReview(id, { rating, comment });
      setReviews((prev) => [...prev, { user: { name: user.name }, rating, comment, createdAt: new Date().toISOString() }]);
      setComment('');
      setRating(5);
      setError('');
    } catch {
      setError('Unable to post review.');
    }
  };

  if (loading) {
    return <div className="status-card">Loading product details…</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <section className="product-page container">
      <div className="product-hero">
        <div className="product-image-panel">
          <img src={product.images?.[0]} alt={product.name} className="product-detail-image" />
        </div>
        <div className="product-summary-card">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description || product.story}</p>
          <div className="product-meta">
            <span>{formatPrice(product.price)}</span>
            <span>{product.rating?.toFixed(1) || '4.5'} ★</span>
          </div>
          <div className="product-actions">
            <label>Quantity</label>
            <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="quantity-input" />
            <button onClick={handleAddToCart} className="button-primary">Add to cart</button>
          </div>
          {message && <div className="status-note">{message}</div>}
        </div>
      </div>

      <div className="reviews-side">
        <div className="review-panel">
          <h2>Customer stories</h2>
          {reviews.length ? (
            reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div>
                  <p className="review-name">{review.user?.name || 'Guest'}</p>
                  <p className="review-time">{formatRelativeTime(review.createdAt)}</p>
                </div>
                <p className="review-rating">{review.rating} ★</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        <div className="review-form-card">
          <h3>Leave a review</h3>
          <form onSubmit={submitReview} className="review-form">
            <label>Rating</label>
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value} stars</option>
              ))}
            </select>
            <label>Comment</label>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="5" />
            <button type="submit" className="button-primary">Submit review</button>
            {error && <p className="status-error">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
