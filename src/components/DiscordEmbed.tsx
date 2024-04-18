import { FC } from "react";

interface DiscordEmbedProps {
  discordLink: string;
}

type DiscordProps = {
  code: boolean;
  id?: string;
  name?: string;
  iconUrl?: string;
  bannerUrl?: string;
};

async function fetchDisc(link: string | null) {
  let result: DiscordProps = { code: false };

  if (link) {
    try {
      const data = await fetch(
        `https://discord.com/api/v10/invites/${new URL(link).pathname.slice(
          1
        )}`,
        {
          cache: "force-cache",
          mode: "cors",
        }
      ).then((res) => res.json());
      //console.log(data);
      if (data.code === 10006) result.code = false;
      result.code = true;
      result.id = data.guild.id;
      result.name = data.guild.name;
      result.iconUrl = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.gif?size=32`;
      result.bannerUrl = `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.gif?size=2048`;
    } catch (error) {
      result.code = false;
    }
  }

  return result;
}

const DiscordEmbed: FC<DiscordEmbedProps> = async ({ discordLink }) => {
  const discord = await fetchDisc(discordLink);

  return (
    !!discord.code && (
      <>
        <p>
          <strong>Server Name:</strong> {discord.name}
        </p>
        <div className="relative">
          <img className="rounded-md" src={discord.bannerUrl} />
          <img
            className="rounded-full absolute -bottom-5 left-5 translate-y-full scale-125"
            src={discord.iconUrl}
          />
        </div>

        <iframe
          title="Discord Iframe"
          height={300}
          src={`https://discord.com/widget?id=${discord.id}&theme=dark`}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          loading="lazy"
          className="w-full border dark:border-zinc-700 rounded-md"
        />
      </>
    )
  );
};

export default DiscordEmbed;
