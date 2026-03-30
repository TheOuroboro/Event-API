
# Event Management & Booking API

A robust backend system for managing events and attendee bookings, built with **Node.js**, **Express**, and **Prisma ORM**.

##  Live Links

* **Documentation:** (https://documenter.getpostman.com/view/50827294/2sBXcEkLRt)
* **Deployed API:** `https://event-api-exzc.onrender.com`

## Features

* **User Authentication:** Secure JWT-based registration and login.
* **Role-Based Access Control (RBAC):** * `ORGANIZER`: Can create, update, and delete events.
* `ATTENDEE`: Can view events and book tickets.


* **Atomic Bookings:** Uses **Prisma Transactions** to ensure ticket quantities are updated accurately and prevent overbooking.
* **Validation:** Strict request body validation using **Joi**.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (hosted on Aiven/Neon)
* **ORM:** Prisma
* **Security:** JSON Web Tokens (JWT) & Bcrypt

## Project Structure

```text
├── src
│   ├── controllers    # Route logic (Auth, Events, Bookings)
│   ├── middleware     # JWT Auth & Validation middlewares
│   ├── routes         # API Endpoint definitions
│   └── config         # Database & Environment configuration
├── prisma
│   └── schema.prisma  # Database models
└── .env               # Environment variables (Local only)

```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TheOuroboro/Event-API.git
cd Event-API

```

### 2. Install dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="yourpersona; _postgresql_connection_string"
JWT_SECRET="your_super_secret_key"
PORT=10000

```

### 4. Run Migrations

```bash
npx prisma migrate dev

```

### 5. Start the server

```bash
npm start

```

## API Endpoints (Quick Summary)

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Get JWT token |
| `GET` | `/api/events` | Public | View all published events |
| `POST` | `/api/events` | Organizer | Create a new event |
| `POST` | `/api/bookings` | Attendee | Book tickets for an event |
| `DELETE` | `/api/bookings/:id` | Attendee | Cancel a booking |

--
