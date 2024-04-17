import CarouselManga from "./components/CarouselManga";
import { db } from "@/lib/db";
import prismaRandom from 'prisma-extension-random';
import { Manga } from "@prisma/client";



const RandomManga = async () => {
    const mangas = shuffleMangas(await pickRandomMangas(10));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: mangas.map((manga, idx) => ({
            '@type': 'ListItem',
            position: idx,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-w-0 h-fit">
                <CarouselManga mangas={mangas} />
            </div>
        </>
    )
};

async function pickRandomMangas(count: number): Promise<Manga[]> {
    const mCount = await db.manga.count();
    const skip = Math.max(0, Math.floor(Math.random() * mCount) - count);

    return db.manga.findMany({
        take: count,
        skip: skip
    })
}

function shuffleMangas(mangas: Manga[]): Manga[] {
    // Deep copy the original array to avoid mutating the original array
    const shuffledMangas = [...mangas];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledMangas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledMangas[i], shuffledMangas[j]] = [shuffledMangas[j], shuffledMangas[i]];
    }

    return shuffledMangas;
}



export default RandomManga;