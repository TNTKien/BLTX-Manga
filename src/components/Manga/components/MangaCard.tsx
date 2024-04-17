import type { Manga } from "@prisma/client";
import Image from "next/image";
import { baseURL } from "@/utils/config";
import MangaImage from "./MangaImage";
import Link from "next/link";


type MangaCardProps = {
    manga: Pick<Manga, "title" | "description" | "cover">;
};

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
    return (
        <div className="shadow-md">
            <div className="grid grid-cols-[.5fr_1fr] gap-2 rounded-md bg-background/40">
                <Link href={`/#`}>
                    <MangaImage
                        priority
                        sizes="(max-width: 640px) 21vw, 25vw"
                        manga={manga}
                    />
                </Link>


                <div className="space-y-1.5 md:space-y-3 px-2 py-0.5 pb-1">
                    <Link href={'/#'}>
                        <p className="text-xl md:text-2xl line-clamp-2 md:line-clamp-3 font-semibold group-hover:text-2xl">
                            {manga.title}
                        </p>
                    </Link>

                    <p className="line-clamp-3 max-sm:text-sm">{manga.description}</p>
                </div>
            </div>
        </div>
    );
};

export default MangaCard;
