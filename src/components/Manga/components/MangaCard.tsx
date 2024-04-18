import type { Manga } from "@prisma/client";
import MangaImage from "./MangaImage";
import Link from "next/link";
import { formatTimeToNow } from '@/lib/utils';


type MangaCardProps = {
    manga: Pick<Manga, "title" | "description" | "cover" | "createdAt" | "id">;
};

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
    return (
        <div className="shadow-md">
            <div className="grid grid-cols-[.5fr_1fr] gap-2 rounded-md bg-background/40">
                <Link href={`/manga/${manga.id}`}>
                    <MangaImage
                        priority
                        sizes="(max-width: 640px) 21vw, 25vw"
                        manga={manga}
                    />
                </Link>
                <div className="relative space-y-1.5 md:space-y-3 px-2 py-0.5 pb-1">
                    <Link href={`/manga/${manga.id}`}>
                        <p className="text-xl md:text-2xl line-clamp-2 md:line-clamp-3 font-semibold">
                            {manga.title}
                        </p>
                    </Link>

                    <p className="line-clamp-3 max-sm:text-sm">{manga.description}</p>

                    <div className="absolute bottom-2 right-4">
                        <time
                            dateTime={new Date(manga.createdAt).toDateString()}
                            className="italic line-clamp-1"
                        >
                            {formatTimeToNow(new Date(manga.createdAt))}
                        </time>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangaCard;
