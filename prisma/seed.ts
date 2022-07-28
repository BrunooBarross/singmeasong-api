import { prisma } from "../src/database.js";
import { faker } from "@faker-js/faker";

async function main(){
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;

    await prisma.recommendation.createMany({
        data: [
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=V1Pl8CzNzCw',
                score: 40
            },
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=50VNCymT-Cs',
                score: 50
            },
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=tt2k8PGm-TI',
                score: 10
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=XTyEXkVU7xQ',
                score: 15
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
                score: 12
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=uelHwf8o7_U',
                score: 20
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=JePnQ1gSagc',
                score: 21
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=bQQ2V16fKsI',
                score: 13
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=bMBODQpL6P0',
                score: 9
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=PsN3bAS13IQ',
                score: 19
            }, 
            {
                name: faker.music.songName(),
                youtubeLink: 'https://www.youtube.com/watch?v=mOIHjAXyJsM',
                score: -4
            },   
        ]
    });
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });