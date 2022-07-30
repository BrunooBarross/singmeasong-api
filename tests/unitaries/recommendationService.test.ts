import { jest } from "@jest/globals";
import * as recommendationsFactory from "../factories/recommendationFactory.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

describe("Unit tests in the recommendations service", () => {
    it("should return a conflict with the same names in the recommendations", async () => {
        const body = recommendationsFactory.recommendationBodyUnit();
        jest.spyOn(recommendationRepository, "findByName")
            .mockResolvedValueOnce(body);
        expect(async () => {
            await recommendationService.insert(body);
        }).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict",
        });
    });

    it("should pass if nothing is wrong", async () => {
        const body = recommendationsFactory.recommendationBodyUnit();

        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementation(() => undefined);

        jest.spyOn(recommendationRepository, "create")
            .mockImplementation(() => undefined);

        await recommendationService.insert(body);
    });

    it("Can't find recommendation to upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);

        expect(async () => {
            await recommendationService.upvote(90);
        }).rejects.toEqual({ message: "", type: "not_found" });
    });

    it("Can't find recommendation to upvote", async () => {
        const body = recommendationsFactory.recommendationBodyUnit();

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(body);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementation(() => undefined);

        await recommendationService.upvote(body.id);
    });
});