import { jest } from "@jest/globals";
import * as recommendationsFactory from "../factories/recommendationFactory.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

describe("Insert Recommedantion", () => {
    it("should return a conflict with the same names in the recommendations", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        jest.spyOn(recommendationRepository, "findByName")
            .mockResolvedValueOnce(recommendationBody);
        expect(async () => {
            await recommendationService.insert(recommendationBody);
        }).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict",
        });
    });

    it("should pass if nothing is wrong", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();

        jest.spyOn(recommendationRepository, "findByName")
            .mockImplementation(() => undefined);

        jest.spyOn(recommendationRepository, "create")
            .mockImplementation(() => undefined);

        await recommendationService.insert(recommendationBody);
    });
});

describe("Upvote Recommedantion", () => {
    it("Can't find recommendation to upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

        expect(async () => {
            await recommendationService.upvote(90);
        }).rejects.toEqual({ message: "", type: "not_found" });
    });

    it("It should pass if nothing's wrong", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();

        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendationBody);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(() => undefined);

        await recommendationService.upvote(recommendationBody.id);
    });
});

describe("Downvote Recommendation", () => {
    it("Can't find recommendation to downvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);

        expect(async () => {
            await recommendationService.downvote(1);
        }).rejects.toEqual({ message: "", type: "not_found" });
    });

    it("It should pass if nothing's wrong", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendationBody);

        jest
            .spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce(recommendationBody);

        await recommendationService.downvote(recommendationBody.id);
        expect(recommendationRepository.updateScore).toHaveBeenCalled();
    });

    it("calls the Repository.remove function if the score is less than -5", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        recommendationBody.score = -10;
        jest
            .spyOn(recommendationRepository, "find")
            .mockResolvedValueOnce(recommendationBody);

        jest
            .spyOn(recommendationRepository, "updateScore")
            .mockResolvedValueOnce(recommendationBody);

        jest
            .spyOn(recommendationRepository, "remove")
            .mockImplementationOnce(async () => { });

        await recommendationService.downvote(recommendationBody.id);

        expect(recommendationRepository.updateScore).toHaveBeenCalled();
        expect(recommendationRepository.remove).toHaveBeenCalled();
    });
});

describe("unitTest getByScore", () => {

    it("should return recommendations", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        const recommendations = [
            { ...recommendationBody, score: 60 },
            { ...recommendationBody, score: 30 }
        ];
        jest
            .spyOn(recommendationRepository, "findAll")
            .mockResolvedValue(recommendations);

        const result = await recommendationService.getByScore("gt");
        expect(result).toEqual(recommendations);
    });
})

describe("unitTest get All", () => {

    it("should return recommendations", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        const recommendations = [
            { ...recommendationBody, score: 60 },
            { ...recommendationBody, score: 30 }
        ];
        jest
            .spyOn(recommendationRepository, "findAll")
            .mockResolvedValue(recommendations);

        const result = await recommendationService.get();
        expect(result).toEqual(recommendations);
    });
})

describe("unitTest getScoreFilter", () => {

    it("should return gt if value is lower than 0.7", async () => {
        const result = recommendationService.getScoreFilter(0.5);
        expect(result).toBe("gt");
    });

    it("should return lte if value is higher than 0.7", async () => {
        const result = recommendationService.getScoreFilter(0.8);
        expect(result).toBe("lte");
    });
});

describe("getTop", () => {

    it("should call recommendationRepository.findAll", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();

        const recommendations = [
            { ...recommendationBody, score: 60 },
            { ...recommendationBody, score: 30 }
        ];

        jest
            .spyOn(recommendationRepository, "getAmountByScore")
            .mockResolvedValueOnce(recommendations);

        const result = await recommendationService.getTop(2);

        expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
        expect(result).toEqual(recommendations);
    });
});

describe("getRadom", () => {

    it("returns at least one recommendation", async () => {
        const recommendationBody = recommendationsFactory.recommendationBodyUnit();
        jest
            .spyOn(recommendationRepository, "findAll")
            .mockResolvedValueOnce([recommendationBody]);

        const recommendation = await recommendationService.getRandom();
        expect(recommendation).toEqual(recommendationBody);
    });

    it("should not found recommendation getRandom", async () => {
        jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue("lte");
        jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

        expect(async () => {
            await recommendationService.getRandom();
        }).rejects.toEqual({ message: "", type: "not_found" });
    });
});