import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../lib/utils.js';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <section className="status-card container">
        <h2>Your cart is empty</h2>
        <p>Find beautifully made items and add them to your cart to continue.</p>
        <Link to="/" className="button-primary">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="cart-page container">
      <div className="section-header">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h2>Your selection of handmade treasures</h2>
        </div>
      </div>
      <div className="page-grid cart-grid">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.product._id} className="cart-item-card">
              <div>
                <h3>{item.product.name}</h3>
                <p>{formatPrice(item.product.price)} each</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                <button className="link-secondary" onClick={() => removeItem(item.product._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <aside className="summary-card">
          <h3>Order summary</h3>
          <p className="summary-price">{formatPrice(totalPrice)}</p>
          <button className="button-primary">Checkout</button>
          <button className="button-secondary" onClick={clearCart}>Clear cart</button>
        </aside>
      </div>
    </section>
  );
}
