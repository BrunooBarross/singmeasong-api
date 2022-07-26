import supertest from "supertest";
import app from "../src/app.js";
import { recommendationBody, findIdByName } from "./factories/recommendationFactory.js"

describe("Route POST /recommendations", () => {
    it("422 on invalid input", async () => {
        const result = await supertest(app).post("/recommendations").send({});
        expect(result.status).toEqual(422);
    });
    it("201 on valid input", async () => {
        const body = recommendationBody();
        const result = await supertest(app).post("/recommendations").send(body);
        expect(result.status).toEqual(201);
    });
    it("409 on conflict", async () => {
        const body = recommendationBody();
        const result = await supertest(app).post("/recommendations").send(body);
        expect(result.status).toEqual(409);
    });
});

describe("route POST /recommendations/:id/upvote", () => {
    it("404 on not found id", async () => {
        const result = await supertest(app).post("/recommendations/2/upvote");
        expect(result.status).toEqual(404);
    });
    it("200 on upvote", async () => {
        const id = await findIdByName("Me ajuda");
        const result = await supertest(app).post(`/recommendations/${id}/upvote`);
        expect(result.status).toEqual(200);
    });
});