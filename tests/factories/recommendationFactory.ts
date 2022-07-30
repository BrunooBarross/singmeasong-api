import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export async function findIdByName(name: string) {
    const result = await prisma.recommendation.findFirst({
        where: {
            name,
        },
    });
    return result.id;
}

export function recommendationBody():CreateRecommendationData {
    const body: CreateRecommendationData = {
        name: "Hapier",
        youtubeLink: "https://www.youtube.com/watch?v=mM0tiwgtoCw",
    };
    return body;
}

export async function getIdByName(name: string) {
    const result = await prisma.recommendation.findFirst({
        where: {
            name,
        },
    });
    return result.id;
}

export function recommendationBodyUnit() {
    const body= {
        id: 23,
        name: "Hapier",
        youtubeLink: "https://www.youtube.com/watch?v=mM0tiwgtoCw",
        score: 0
    };
    return body;
}