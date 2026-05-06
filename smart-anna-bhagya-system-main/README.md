# Smart Anna Bhagya Booking System

A comprehensive frontend prototype for a digital ration distribution system built with React, TypeScript, and Tailwind CSS.

---

## 🌟 Features

### 👤 Users (Ration Card Holders)

* Registration with family details and ration card upload
* Secure login and password reset
* View allocated ration (Rice, Ragi, Wheat, Sugar)
* Book slots with date/time selection
* View crowd status and live queue count
* Priority booking for special categories
* Token number and QR code generation
* Booking cancellation
* Mock SMS/WhatsApp confirmation

---

### 🏪 Distributors

* Secure login with distributor ID
* Manage time slots
* Update stock levels
* Low stock alerts
* Analytics dashboard with charts
* Performance metrics

---

### 🏛️ Admin (Government Authority)

* Secure admin login
* State-wide dashboard
* District monitoring
* Distributor performance tracking
* Real-time activity feed
* Export reports
* Filter by date and district

---

## 🎨 UI & Design

* Clean modern UI
* Fully responsive (mobile + desktop)
* Role-based color themes
* Interactive charts
* QR code generation
* Smooth animations and loading states

---

## 🚀 Demo Credentials

### User

* Register with any data
* Example ration number: `KA29AB1234567890`

### Distributor

* `dist001 / admin123`
* `dist002 / admin123`

### Admin

* `admin / admin@2026`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx
│   └── components/
│       ├── Landing.tsx
│       ├── user/
│       ├── distributor/
│       └── admin/
```

---

## 🔧 Technologies Used

* React
* TypeScript
* Tailwind CSS
* React Router
* Recharts
* QRCode.react
* Lucide Icons

---

## 💾 Data Handling

* Uses localStorage (mock data)
* No backend connected yet

---

## 🔌 Backend Integration (Future)

* Replace localStorage with APIs
* Add JWT authentication
* Use WebSockets for real-time updates
* Integrate SMS/WhatsApp APIs

---

## 🔒 Security Notes

* Use hashed passwords (bcrypt)
* Add input validation
* Use HTTPS
* Implement proper authentication

---

## 🚀 Getting Started

Run the project:

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173/
```

---

## 📝 Notes

* This is a frontend prototype
* No real backend integration
* Uses mock data

---

## 🔮 Future Improvements

* Real-time updates
* Notifications
* Multi-language support
* Offline mode
* AI-based analytics

---

Built for the Smart Anna Bhagya initiative 🚀
