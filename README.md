# 🚖 Ride Booking API System

A RESTful API system built with **Express.js**, **MongoDB**, and **TypeScript**, designed to manage a real-time ride booking platform with support for riders, drivers, and admins.

## 📌 Project Overview

This system supports:

- Role-based access control (Rider, Driver, Admin)
- Ride lifecycle management (Request, Accept, Pickup, Transit, Complete, Cancel)
- JWT-based authentication
- Driver approval and online status management
- Distance-based fare calculation (Haversine formula)
- Ride history tracking

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/miraz46/levelTwo-assignmentFive-server.git
cd ride-booking-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
DB_URL=
NODE_ENV=development

JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=
JWT_REFRESH_SECRET=your_jwt_secret
JWT_REFRESH_EXPIRES=
BCRYPT_SALT_ROUND=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
EXPRESS_SESSION_SECRET=
```

### 4. Run the Project

```bash
npm run dev
```

---

## 📫 API Endpoints Summary

> Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication

| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| POST   | `/auth/register` | Register user           |
| POST   | `/auth/login`    | Login & receive token   |

---

### 👤 Users (Admin only)

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/users`           | Get all users              |
| PATCH  | `/users/block/:id` | Block/unblock user         |

---

### 🚗 Drivers

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| PATCH  | `/drivers/approve/:id`      | Approve a driver (Admin only)  |
| PATCH  | `/drivers/online-status`    | Update driver online status    |
| GET    | `/drivers/earnings/:id`     | Get total completed ride count |

---

### 🚕 Rides

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| POST   | `/rides/request`       | Rider requests a ride            |
| DELETE | `/rides/cancel/:id`    | Cancel a ride (by rider)         |
| PATCH  | `/rides/accept/:id`    | Driver accepts a ride            |
| PATCH  | `/rides/reject/:id`    | Driver rejects a ride            |
| PATCH  | `/rides/status/:id`    | Driver updates ride status       |
| GET    | `/rides/history`       | Get ride history (rider/driver)  |
| GET    | `/rides`               | Get all rides (Admin only)       |

---

## 🧠 Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- Zod (Validation)
- JWT (Authentication)
- bcrypt (Password Hashing)

---



## 📞 Contact

For issues or feature requests, please contact: [mirajrahman8@gmail.com]
