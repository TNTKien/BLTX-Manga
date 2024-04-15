import Image from "next/image";
import axiosInstance from "@/lib/axios";
import {Manga} from "@prisma/client";
import { baseURL } from "@/utils/config";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";

async function getMangas() {
  const {data} = await axiosInstance.get("/api/manga");
  return data.data as Manga[];
}

export default async function Home() {
  const mangas = await getMangas();
  console.log(mangas);
  return (
    <main>
      <div>
        <p>Hello World</p>
      </div>
    </main>
  );
}
