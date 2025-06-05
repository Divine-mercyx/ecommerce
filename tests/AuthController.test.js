import request from "supertest";
import express from "express";
import {signup} from "../controllers/AuthController.js";
import describe from "mocha";
import {expect} from "chai";


const app = express();
app.use(express.json());
app.post("/signup", signup);

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
