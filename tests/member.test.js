const request = require('supertest');
const app = require('../server'); // Import your Express app
const { Member, sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
});

describe('Members API', () => {
    let token;

    test('Should register a new member', async () => {
        const res = await request(app).post('/api/members').send({
            name: "John Doe",
            email: "johndoe@example.com",
            membershipType: "premium",
            joinDate: "2025-01-15",
            status: "active"
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // Save token for authenticated tests
    });

    test('Should log in and return a token', async () => {
        const res = await request(app).post('/api/members/login').send({
            email: "johndoe@example.com"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test('Should get all members (Authenticated)', async () => {
        const res = await request(app)
            .get('/api/members')
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.members.length).toBeGreaterThan(0);
    });
});

afterAll(async () => {
    await sequelize.close(); // Close DB connection after tests
});
