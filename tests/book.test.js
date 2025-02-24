const request = require('supertest');
const app = require('../server');
const { Book, sequelize } = require('../models');

describe('Books API', () => {
    let token;

    beforeAll(async () => {
        // ✅ Reset the test database
        await sequelize.sync({ force: true });

        console.log("📌 Test database reset");

        // ✅ Create a test member before login
        await request(app).post('/api/members').send({
            name: "John Doe",
            email: "johndoe@example.com",
            membershipType: "premium",
            joinDate: "2025-01-15",
            status: "active"
        });

        console.log("✅ Test member created");

        // ✅ Log in and store token for authenticated requests
        const loginRes = await request(app).post('/api/members/login').send({
            email: "johndoe@example.com"
        });

        token = loginRes.body.token;
        console.log("🔑 Generated Token:", token); // Debug log

        // ✅ Ensure token exists before running tests
        if (!token) {
            throw new Error("❌ Token not received from login API.");
        }
    });

    test('Should create a new book', async () => {
        expect(token).toBeDefined(); // ✅ Ensure token exists

        const res = await request(app)
            .post('/api/books')
            .set("Authorization", `Bearer ${token}`)
            .send({
                isbn: "978-3-16-148410-0",
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Classic",
                publicationYear: 1925,
                totalCopies: 5,
                availableCopies: 5
            });

        console.log("📌 Create Book Response:", res.body); // Debug log

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    test('Should get all books', async () => {
        const res = await request(app)
            .get('/api/books')
            .set("Authorization", `Bearer ${token}`); // Ensure authentication

        console.log("📌 Get All Books Response:", res.body); // Debug log

        expect(res.statusCode).toBe(200);
        expect(res.body.books.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await sequelize.close();
        console.log("📌 Database connection closed after tests");
    });
});
