import MangaCard from './components/MangaCard';
import { Manga } from "@prisma/client";
import axiosInstance from '@/lib/axios';

async function getMangas() {
    const { data } = await axiosInstance.get("/api/manga");
    return data.data as Manga[];
}

const LatestManga = async () => {
    const mangas = await getMangas();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-y-8">
            {mangas.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
            ))}
        </div>
    );
};

export default LatestManga;