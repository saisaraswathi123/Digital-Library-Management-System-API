# 📚 Library Management System API

A RESTful API built with **Node.js, Express, Sequelize, and PostgreSQL** for managing books, members, borrowings, and reading progress.

---

## 🚀 Setup Instructions

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/your-repository.git
cd your-repository
2️⃣ Install Dependencies
npm install
3️⃣ Configure Database
Modify the database configuration in config/config.json:

{
  "development": {
    "username": "postgres",
    "password": "password",
    "database": "library_management",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
4️⃣ Run Migrations
npx sequelize-cli db:migrate

5️⃣ Start the Server
npm start
The server will start at http://localhost:5000

📌 API Documentation
 Authentication
🔹 Login (Generate Token)



POST /api/members/login
📌 Request Body:




{ "email": "johndoe@example.com" }
📌 Response (200 OK):




{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token" }
📌 Books
🔹 Create a Book



POST /api/books
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token
📌 Request Body:




{
  "isbn": "978-3-16-148410-0",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "publicationYear": 1925,
  "totalCopies": 5,
  "availableCopies": 5
}
📌 Response (201 Created):




{
  "id": 1,
  "isbn": "978-3-16-148410-0",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "publicationYear": 1925,
  "totalCopies": 5,
  "availableCopies": 5
}
🔹 Get All Books



GET /api/books
📌 Response (200 OK):




{
  "total": 1,
  "books": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Classic",
      "publicationYear": 1925
    }
  ]
}
📌 Members
🔹 Register a Member



POST /api/members
📌 Request Body:




{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "membershipType": "premium",
  "joinDate": "2025-01-15"
}
📌 Response (201 Created):




{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "membershipType": "premium",
  "joinDate": "2025-01-15"
}
🔹 Get All Members



GET /api/members
📌 Response (200 OK):




{
  "total": 1,
  "members": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "membershipType": "premium"
    }
  ]
}
📌 Borrowings
🔹 Create a Borrowing



POST /api/borrowings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token
📌 Request Body:




{
  "bookId": 1,
  "memberId": 1,
  "borrowDate": "2025-01-20",
  "dueDate": "2025-02-03"
}
📌 Response (201 Created):




{
  "id": 1,
  "bookId": 1,
  "memberId": 1,
  "borrowDate": "2025-01-20",
  "dueDate": "2025-02-03",
  "status": "active"
}
🔹 Return a Book



PUT /api/borrowings/1/return
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token
📌 Response (200 OK):




{ "message": "Book returned successfully" }
🔹 Get Overdue Borrowings



GET /api/borrowings/overdue
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token
📌 Response (200 OK):




[
  {
    "id": 2,
    "bookId": 1,
    "memberId": 1,
    "status": "active",
    "dueDate": "2025-01-01"
  }

]


📌 Database Schema Diagram

+-----------------+        +-----------------+        +-----------------+        +---------------------+
|   Members      |        |   Books         |        |   Borrowings    |        |   Reading Progress  |
+-----------------+        +-----------------+        +-----------------+        +---------------------+
| id (PK)        |----+   | id (PK)         |----+   | id (PK)         |----+   | id (PK)             |
| name           |    |   | isbn            |    |   | bookId (FK)     |    |   | borrowingId (FK)    |
| email          |    |   | title           |    |   | memberId (FK)   |    |   | currentPage         |
| membershipType |    |   | author          |    |   | borrowDate      |    |   | readingTime         |
| joinDate       |    |   | genre           |    |   | dueDate         |    |   | notes               |
| status         |    |   | totalCopies     |    |   | status          |    |   | lastReadDate        |
+-----------------+    |   | availableCopies |    |   +-----------------+    |   +---------------------+
                        +-----------------+        +-----------------+        +---------------------+
📌 Technologies Used
Node.js - Backend Framework
Express.js - Routing & Middleware
Sequelize - ORM for Database Management
PostgreSQL - Database
JWT - Authentication
Jest & Supertest - Unit Testing
