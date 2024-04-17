'use client';

import '@/styles/mantine/globals.css';
import classes from '@/styles/mantine/manga.module.css';
import { Carousel, type Embla } from '@mantine/carousel';
import '@mantine/carousel/styles.layer.css';
import { useMediaQuery } from '@mantine/hooks';
import type { Manga } from '@prisma/client';
import Autoplay from 'embla-carousel-autoplay';
import { type EmblaCarouselType as CarouselApi } from 'embla-carousel';
import Link from 'next/link';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import MangaImage from './MangaImage';
import { cn } from '@/lib/utils';

interface CarouselMangaProps {
    mangas: Pick<Manga, 'id' | 'title' | 'description' | 'cover'>[];
};

const CarouselManga: FC<CarouselMangaProps> = ({ mangas }) => {
    const autoplay = useRef(Autoplay({ delay: 2000 }));
    const isMobile = useMediaQuery('(max-width: 640px)');
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

    const handleSlideInView = useCallback((emblaCallback: CarouselApi) => {
        const currentSlide = emblaCallback.slidesInView();

        setCurrentSlideIdx(currentSlide[0] ?? 0);
    }, []);

    useEffect(() => {
        if (embla) {
            embla.on('slidesInView', handleSlideInView);
        }
    }, [embla, handleSlideInView]);

    return (
        <Carousel
            loop
            withIndicators
            plugins={[autoplay.current]}
            getEmblaApi={setEmbla}
            classNames={classes}
            align={"start"}
            slideGap="md"
            inViewThreshold={0.9}
            slideSize={"15%"}
            slidesToScroll={1}
        >
            {/* {!isMobile ? () : () } */}


            {mangas.map((manga, idx) => (
                <Carousel.Slide key={manga.id}>
                    <Link
                        href={`/`}
                    >
                        <MangaImage
                            priority
                            sizes="20vw"
                            manga={manga}
                        />
                    </Link>
                </Carousel.Slide>
            ))}
        </Carousel >
    );
};

export default CarouselManga;