import React, { useState } from "react";
import { baseURL } from "@/utils/config";
import { ExternalLink, Search } from "lucide-react";
import { Tags, type Manga } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import { Input } from "@nextui-org/react";
import MangaImage from "./Manga/components/MangaImage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { TagsModal } from "./TagsModal";
type MangaSearchResult = Pick<Manga, "id" | "title" | "cover">;

const SearchBar = () => {
  const router = useRouter();
  const [activeSearch, setActiveSearch] = useState<MangaSearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const handleSearch = (e: { target: { value: string } }) => {
    if (e.target.value == "") {
      setActiveSearch([]);
      return false;
    }
    searchManga(e.target.value).then((data) => {
      return setActiveSearch(data);
    });
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  return (
    <div className="relative">
      <Input
        classNames={{
          base: `max-w-full h-10 w-full ${
            isFocused ? "md:w-[500px]" : "md:w-48"
          }`,
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper: "h-full font-normal text-default-500 bg-default-400/20",
        }}
        defaultValue=""
        autoComplete="off"
        placeholder="Nhập từ khoá..."
        size="sm"
        startContent={<Search size={18} />}
        endContent={<TagsModal />}
        type="search"
        onChange={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsFocused(false);
            const search = e.currentTarget.value;
            if (search) {
              router.push(`/search/manga?q=${search}`);
            }
          }
        }}
      />
      {isFocused && activeSearch.length > 0 && (
        <div className="absolute top-12 -right-1 md:right-0 bg-white border border-gray-300 rounded-lg w-[350px] md:w-[500px] max-h-96 overflow-x-auto px-3 py-1">
          {/* <Link
            href={"/manga/6646780c5ba8c6b1c01aa1fe"}
            className="text-blue-600 underline"
          >
            Tìm kiếm nâng cao
          </Link> */}
          {activeSearch.map((manga) => (
            <Link
              key={manga.id}
              href={`/manga/${manga.id}`}
              className="grid grid-cols-[.3fr_1fr] gap-4 rounded-md group transition-colors hover:bg-background/20"
            >
              <div className="relative py-2">
                <MangaImage sizes="15vw" manga={manga} />
              </div>

              <div className="space-y-1.5 py-2">
                <p className="text-lg font-semibold transition-all group-hover:text-xl">
                  {manga.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

async function searchManga(keyword: string) {
  const { data } = await axiosInstance.get(`/api/search/manga?q=${keyword}`);
  return data.data as MangaSearchResult[];
}
