import prisma from "~/lib/prisma";
import { parse } from "node-html-parser";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // get url from query
  const { url } = getQuery(event);

  if (!url) {
    return {
      error: "No url provided",
    };
  }

  // scrape website
  const data = await scrape(url as string);

  return data;
});

const maisconsultores = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const parser = parse(html);

  const images = parser.querySelectorAll(".lightbox-item")?.map((img) => {
    if (img.getAttribute("src")) {
      return img.getAttribute("src");
    } else {
      return img.getAttribute("data-src");
    }
  });
  const name = parser.querySelector(".property-title")?.text;
  const location = parser.querySelector(".property-location")?.text;
  const price = parser.querySelector(".property-price")?.text;
  const description = parser.querySelector(".property-description > div")?.text;

  return {
    images: images ?? [],
    name: name?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    location: location?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    price:
      Number(
        price
          ?.replace(/€/gm, "")
          .replace(/\s/gm, "")
          .replace(/\€/gm, "")
          .replace(/\//gm, "")
          .replace(/Mês/gm, "")
      ) ?? "",
    description: description ?? "",
  };
};

const remax = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });
  const html = await response.text();
  const parser = parse(html);

  const images = parser
    .querySelectorAll(
      '[style="height: 100vh; overflow-y: auto;"] .MuiStack-root img[loading="lazy"] '
    )
    ?.map((img) => {
      return img.getAttribute("src");
    })
    .map((img) => new URL(url).host + img);
  const name = parser.querySelector(
    '[class="w-full md:w-auto text-h3-sm md:text-h3 font-extrabold line-clamp-2 text-black text-left leading-9"]'
  )?.text;
  const location = parser.querySelector(
    '[class="text-sm md:text-base font-medium truncate"]'
  )?.text;
  const price = parser.querySelector(
    '[class="relative leading-[130%]"] > span'
  )?.text;
  const description = parser.querySelector(".custom-description")?.text;

  return {
    images: images ?? [],
    name: name?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    location: location?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    price: Number(price?.replace(/€/gm, "").replace(/\s/gm, "")) ?? "",
    description: description ?? "",
  };
};

const casaSapo = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const parser = parse(html);

  const images = parser
    .querySelectorAll(
      ".detail-media-imgs [class='swiper-slide'] picture [media='(min-width: 720px)']"
    )
    ?.map((img) => {
      if (img.hasAttribute("srcset")) {
        return img.getAttribute("srcset");
      }
      return img.getAttribute("data-srcset");
    })
    .filter((img) => img?.endsWith(".jpg"));
  const name = parser.querySelector(".detail-section detail-title")?.text;
  const location = parser.querySelector(".detail-title-location")?.text;
  const price = parser.querySelector(".detail-title-price-value")?.text;
  const description = parser.querySelector(".detail-description-text")?.text;

  return {
    images: images ?? [],
    name: name?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    location: location?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    price:
      Number(
        price?.replace(/€/gm, "").replace(/\s/gm, "").replace(/\./gm, "")
      ) ?? "",
    description: description ?? "",
  };
};

const idealista = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const parser = parse(html);

  const name = parser.querySelector(".main-info__title-main")?.text;
  const location = parser.querySelector(".main-info__title-minor")?.text;
  const price = parser.querySelector(".info-data-price")?.text;
  const description = parser.querySelector(".comment p")?.text;

  return {
    images: [],
    name: name?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    location: location?.replace(/\/n/gm, "")?.replace(/\n/gm, "").trim() ?? "",
    price:
      Number(
        price?.replace(/€/gm, "").replace(/\s/gm, "").replace(/\./gm, "")
      ) ?? "",
    description: description ?? "",
  };
};

const scrape = async (url: string) => {
  switch (new URL(url).host) {
    case "www.maisconsultores.pt":
      return await maisconsultores(url);
    case "remax.pt":
    case "www.remax.com.br":
      return await remax(url);
    case "casa.sapo.pt":
      return await casaSapo(url);
    case "www.idealista.pt":
      return await idealista(url);
    default:
      return {
        error: "Not supported",
      };
  }
};
