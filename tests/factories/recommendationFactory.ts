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

export function recommendationBody() {
    const body: CreateRecommendationData = {
        name: "Me ajuda",
        youtubeLink: "https://www.youtube.com/watch?v=mM0tiwgtoCw",
    };
    return body;
}