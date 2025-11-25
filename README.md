# 🌾 Krushi Smart Billing Web-App

> **A modern, smart & scalable billing + inventory system built to simplify business operations and boost efficiency.**
> Designed for retailers, wholesalers, and growing businesses who want complete control over their sales, stock, and reporting in one powerful dashboard.

---

## 🚀 Overview

**Krushi Smart Billing** is a full-stack web application that streamlines business processes like billing, inventory tracking, supplier management, and detailed analytics. With a clean UI and secure backend, it delivers speed, accuracy, and real-time insights.

---

## 🌐 Live Demo

🚀 Try the application here:
👉 [https://krushi-bill.vercel.app/](https://krushi-bill.vercel.app/)

Experience real-time billing, inventory management, and dashboard analytics in action.

**Krushi Smart Billing** is a full-stack web application that streamlines business processes like billing, inventory tracking, supplier management, and detailed analytics. With a clean UI and secure backend, it delivers speed, accuracy, and real-time insights.

---

## ✨ Key Highlights

✅ Role-based Access System
✅ Smart Stock & Inventory Tracking
✅ Fast Invoice Generation with PDF Export
✅ GST & Tax Ready Reports
✅ Real-time Dashboard Analytics
✅ Secure Authentication System
✅ Mobile Responsive Interface

---

## 🧩 Core Features

### 👤 User Management

* Owner, Manager & Staff roles
* Controlled access based on permissions
* Secure login with JWT Authentication

### 📦 Inventory Management

* Product & Category Management
* Stock level tracking
* Low stock alerts
* Easy updates & monitoring

### 🧾 Sales & Billing

* Create professional invoices
* Multiple payment modes (Cash, Card, UPI)
* Customer management
* Auto calculations & tax handling

### 🛒 Purchase System

* Supplier management
* Purchase order handling
* Stock auto updates on purchase

### 📊 Reports & Analytics

* Sales Reports
* Purchase Reports
* GST & Financial Reports
* Visual dashboard insights

### ⚙️ System Settings

* Business profile setup
* GST configuration
* Invoice template customization

### 📄 PDF Generator

* Downloadable invoice PDFs
* Print-ready formats

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology            | Description                   |
| --------------------- | ----------------------------- |
| React (Vite)          | High-performance UI framework |
| TypeScript            | Type-safe development         |
| Tailwind CSS          | Utility-first styling         |
| shadcn/ui             | Modern UI components          |
| React Query           | Data fetching & caching       |
| React Router          | SPA navigation                |
| React Hook Form + Zod | Form validation               |
| Recharts              | Interactive charts            |
| Leaflet               | Map integration               |

### ⚙️ Backend

| Technology    | Description           |
| ------------- | --------------------- |
| Node.js       | Runtime environment   |
| Express.js    | API Framework         |
| PostgreSQL    | Relational Database   |
| Prisma        | ORM for DB handling   |
| JWT           | Secure Authentication |
| Bcrypt        | Password hashing      |
| Helmet & CORS | Security layers       |

---

## 📋 Prerequisites

* Node.js v18+
* PostgreSQL Database

---

## ⚡ Installation Guide

### 🔽 Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Krushi-App
```

---

## 🔧 Backend Setup

```bash
cd Backends
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
```

Initialize Database:

```bash
npm run db:generate
npm run db:push
npm run db:seed # optional
```

Run Backend Server:

```bash
npm run dev
```

✅ Backend running on: `http://localhost:5000`

---

## 🎨 Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

Start Frontend Server:

```bash
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## 🗂️ Project Structure

```
Krushi-App/
├── Backends/
│   ├── prisma/
│   ├── src/
│   │   ├── Controllers/
│   │   ├── Routes/
│   │   ├── Middleware/
│   │   └── Utils/
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Services/
│   │   └── Hooks/
└── README.md
```

---

## 📸 Preview (Coming Soon)

> Add screenshots or GIF demos for better presentation.

---

## 🔐 Security Practices

* Encrypted Password Storage
* Token-based Authentication
* Secure Headers via Helmet
* CORS Protected APIs

---

## 🌟 Future Enhancements

* 📱 Mobile App Version
* 📈 Advanced AI Analytics
* 🧾 Multi-branch Support
* 🌐 Cloud Deployment

---

## 🤝 Contribution

Contributions are welcome! Fork the repo and submit your pull requests.

---

## 📞 Support

For issues or feature requests, please raise an issue or contact the developer.

---

### 💚 Built with dedication for smart business growth

**Krushi Smart Billing – Smart Business. Smart Accounting.**
