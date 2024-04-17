import CarouselManga from "./components/CarouselManga";
import { db } from "@/lib/db";

const RandomManga = async () => {
    const mangas = await db.manga.findMany({
        take: 10,
        orderBy: {
            title: 'asc',
        },
        select: {
            id: true,
            title: true,
            description: true,
            cover: true,
        },
    });
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

export default RandomManga;