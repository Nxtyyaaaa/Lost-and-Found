# 🧳 Lost and Found Portal

A full-stack web application designed to streamline the reporting, discovery, and recovery of lost or found items on a campus. The platform supports image uploads, Google authentication, role-based access, and an intuitive UI for users to post, browse, and manage items.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**

  * JWT & cookie-based login
  * Google OAuth login using Passport.js
  * Email verification & password reset via email

* 👤 **User Management**

  * Profile image uploads with Cloudinary
  * Role-based access control
  * Editable user profiles (name, branch, image)

* 📦 **Item Management**

  * Create, update, and delete lost/found item listings
  * Filter by category, location, and type
  * Paginated listings
  * Upload up to 5 images per item

* 🌐 **Frontend**

  * Responsive UI with React
  * Redux for state management
  * React Router for navigation
  * Toast notifications and modals

* ☁️ **Backend**

  * Express.js + MongoDB
  * Custom error handling
  * Middleware-based security & permissions
  * Cloudinary integration for image handling

---

## 🛠️ Tech Stack

### Frontend:

* React
* Redux Toolkit
* React Router DOM
* Axios
* React Toastify

### Backend:

* Node.js
* Express.js
* MongoDB & Mongoose
* Passport.js (Google OAuth)
* Cloudinary SDK
* Nodemailer
* JWT & cookies

---

## 🖼️ Screenshots

> *Include UI screenshots here for Home Page, Login, Dashboard, Item Card, etc.*

---

## 📦 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/lost-and-found-portal.git
cd lost-and-found-portal
```

### 2. Setup backend

```bash
cd server
npm install

# Create a .env file with your MongoDB URI, JWT secret, email config, and Cloudinary keys
npm run dev
```

### 3. Setup frontend

```bash
cd client
npm install
npm start
```

### 4. Environment variables

**Required in `/server/.env`:**

```
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret
JWT_LIFETIME=1d
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
EMAIL_HOST=xxx
EMAIL_PORT=xxx
EMAIL_USER=xxx
EMAIL_PASS=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 📁 Folder Structure

```
.
├── client/               # React frontend
│   ├── components/       # UI Components
│   └── pages/            # Main views (Home, Login, Dashboard, etc.)
│
├── server/               # Express backend
│   ├── controllers/      # Route logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, error, file handlers
│   └── utils/            # Token, email, permissions, etc.
```

---

## ✨ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 🙋‍♀️ Acknowledgements

* Cloudinary for media management
* MongoDB Atlas for database hosting
* React Toastify for beautiful notifications
* Passport.js for OAuth integration

