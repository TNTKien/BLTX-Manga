import axiosInstance from "./axios";
import { db } from "./db";
import { generateSearchPhrase } from "./utils";
import { Manga } from "@prisma/client";

export const searchManga = async ({
  searchPhrase,
  take,
  skip = 0,
}: {
  searchPhrase: string;
  take: number;
  skip?: number;
}): Promise<Manga[]> => {
  const query = generateSearchPhrase(searchPhrase);
  const { data } = await axiosInstance.get(
    `/api/search/manga?q=${query}&limit=${take}&offset=${skip}`
  );
  //console.log(data.data);
  return data.data as Manga[];
};

export type SearchUserResult = {
  name: string;
  image: string;
  color: string;
};

// export const searchUser = ({
//   searchPhrase,
//   take,
//   skip = 0,
// }: {
//   searchPhrase: string;
//   take: number;
//   skip?: number;
// }): Promise<SearchUserResult[]> => {
//   const query = generateSearchPhrase(searchPhrase);

//   return db.$queryRaw`SELECT "name", "image", "color" FROM "User" WHERE to_tsvector('english', "name") @@ to_tsquery(${query}) LIMIT ${take} OFFSET ${skip}`;
// };

export const countFTResult = async (
  searchPhrase: string,
  type: "Manga" | "User"
): Promise<{ count: number }[]> => {
  const query = generateSearchPhrase(searchPhrase);

  if (type === "Manga") {
    const total = await db.manga.count({
      where: {
        title: {
          mode: "insensitive",
          contains: query,
        },
      },
    });
    return [{ count: total }];
  }

  const total = await db.user.count({
    where: {
      username: {
        mode: "insensitive",
        contains: query,
      },
    },
  });
  return [{ count: total }];
};

export type Tags = {
  category: string;
  data: {
    id: number;
    name: string;
    description: string;
  }[];
};
