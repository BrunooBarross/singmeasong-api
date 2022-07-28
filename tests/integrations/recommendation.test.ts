import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import { recommendationBody, findIdByName, getIdByName } from "../factories/recommendationFactory.js"

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Route POST /recommendations", () => {
    it("Returns 201 if the body is correct and persists the data", async () => {
        const body = recommendationBody();
        const result = await supertest(app).post("/recommendations").send(body);
        const id = await getIdByName("Hapier");
        expect(result.status).toEqual(201);
        expect(id).not.toBeNull();
    });
    it("Returns 422 if the body is not correct", async () => {
        const result = await supertest(app).post("/recommendations").send({});
        expect(result.status).toEqual(422);
    });
    it("Returns 409 if name is in use", async () => {
        const body = recommendationBody();
        const result = await supertest(app).post("/recommendations").send(body);
        expect(result.status).toEqual(409);
    });
});

describe("route POST /recommendations/:id/upvote", () => {
    it("Returns 404 if not found id", async () => {
        const result = await supertest(app).post("/recommendations/50/upvote");
        expect(result.status).toEqual(404);
    });
    it("Returns 200 on upvote", async () => {
        const id = await findIdByName("Hapier");
        const result = await supertest(app).post(`/recommendations/${id}/upvote`);
        expect(result.status).toEqual(200);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("Returns 404 if there is no id", async () => {
        const response = await supertest(app).post("/recommendations/100/downvote");
        expect(response.status).toEqual(404);
    });
    it("Returns 200 on downvote", async () => {
        const id = await getIdByName("Hapier");
        const response = await supertest(app).post(`/recommendations/${id}/downvote`);
        expect(response.status).toEqual(200);
    });
});

describe("GET /recommendations/:id ", () => {
    it("Returns 200 if there is recommendation by id", async () => {
        const id = await getIdByName("Hapier");
        const response = await supertest(app).get(`/recommendations/${id}`);
        const status = response.status;
        expect(status).toEqual(200);
        expect(response.body).toEqual(expect.objectContaining({id, ...recommendationBody(), score: 0}));
    });
});

describe("GET /recommendations ", () => {
    it("should return status 200 and a list of recommendations", async () => {
      const response = await supertest(app).get("/recommendations");
      expect(response.body.length).toEqual(10);
      expect(response.status).toEqual(200);
    });
  });