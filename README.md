Event Management API (Capstone 2026)
This is a professional backend API for managing events, bookings, and user authentication.

- Live API URL
[Insert your Render URL here after deployment]

- Tech Stack
Tech Stack Explanation

Node.js & Express: Backend runtime and framework for handling HTTP requests.

Prisma ORM: Modern database toolkit for type-safe database access and migrations.

PostgreSQL: Relational database for structured data storage (hosted on Render/Neon).

JWT (Json Web Token): For secure, stateless user authentication.

Joi: Schema description language and data validator for JavaScript.

Bcryptjs: For hashing passwords to ensure security.

- Architecture Overview
The project follows a Modular Layered Architecture to ensure clean code and separation of concerns:

Routes: Defines endpoints and maps them to controllers.

Controllers: Handles the request/response logic and business rules.

Middleware: Handles authentication (JWT verification) and role-based access.

Utils: Reusable logic for pagination, token generation, and password hashing.

Prisma Schema: Models the database structure and relationships.

📖 Key Features
Authentication: Secure user registration and login with hashed passwords.

Role-Based Access: Organizers can create/edit events; Attendees can only view and book.

Pagination: The /events endpoint supports page and limit query parameters for performance.

Ownership Protection: Only the organizer who created an event can edit or delete it.

   Setup Instructions
1. Prerequisites
Node.js (v18+)

A Neon.tech (PostgreSQL) account

2. Installation
Clone the repository:

Bash
git clone <https://github.com/TheOuroboro/Event-API.git>
Install dependencies:

Bash
npm install
3. Environment Variables
Create a .env file in the root directory and add:

Plaintext
PORT=5000
DATABASE_URL="your_neon_connection_string" // you could generate yours on neon
JWT_SECRET="your_generated_secret" //generatte yours
JWT_EXPIRES_IN="1d"
4. Database Setup
Sync your database schema:

Bash
npx prisma db push
5. Start the Server
Bash
npm run dev