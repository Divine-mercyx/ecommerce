const express = require("express");
const request = require("supertest");
const { signup } = require("../controllers/AuthController");

const app = express();
app.use(express.json());
app.post("/signup", signup); // Set up the endpoint

describe('POST /signup', () => {
    it("should create a new user", async () => {
        const response = await request(app)
            .post("/signup")
            .send({
                username: "test",
                email: "test@gmail.com",
                password: "test123",
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("signup successful");
    });
});
