# Artisan Marketplace

A web-based marketplace that connects local artisans with customers by providing a platform to showcase and sell handmade products. The application allows artisans to manage their products while customers can browse, search, and purchase unique handcrafted items.

---

## Features

### Customer
- User registration and login
- Browse products by category
- Search products
- Product details page
- Shopping cart
- Place orders
- View order history

### Artisan
- Artisan registration
- Add new products
- Edit and delete products
- Manage inventory
- View customer orders

### Admin
- Dashboard
- Manage users
- Approve artisan accounts
- Manage products
- Manage categories
- Monitor orders

---

## Tech Stack

**Frontend**
- HTML5
- CSS3
- Bootstrap
- JavaScript

**Backend**
- Django
- Python

**Database**
- SQLite

---

## Project Structure

```
artisan-marketplace/
│
├── static/
├── templates/
├── media/
├── users/
├── products/
├── orders/
├── marketplace/
├── db.sqlite3
├── manage.py
└── requirements.txt
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/ratnasingh90999-prog/artisan-marketplace.git
```

Move into the project directory

```bash
cd artisan-marketplace
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Start the development server

```bash
python manage.py runserver
```

Open your browser and visit

```
http://127.0.0.1:8000/
```

---

## Screenshots

Add screenshots of:

- Home Page
- Product Listing
- Product Details
- Cart
- Admin Dashboard
- Artisan Dashboard

---

## Future Improvements

- Online payment integration
- Product reviews and ratings
- Wishlist
- Email notifications
- Live order tracking
- AI-based product recommendations
- Multi-language support

---

## Learning Outcomes

This project helped me understand:

- Django project structure
- Authentication and authorization
- CRUD operations
- File uploads
- Database relationships
- Bootstrap integration
- Session management

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## License

This project is developed for educational and learning purposes.

---

## Author

**Ratna Singh**

GitHub: https://github.com/ratnasingh90999-prog
