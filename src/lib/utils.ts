import { ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/vi";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(second: number) {
  return new Promise((res) => setTimeout(res, second * 1000));
}

export const groupBy = <T>(
  array: T[],
  // eslint-disable-next-line no-unused-vars
  predicate: (value: T, index: number, array: T[]) => any
) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

const formatDistanceLocale = {
  lessThanXSeconds: "vừa xong",
  xSeconds: "vừa xong",
  halfAMinute: "vừa xong",
  lessThanXMinutes: "{{count}} phút",
  xMinutes: "{{count}} phút",
  aboutXHours: "{{count}} giờ",
  xHours: "{{count}} giờ",
  xDays: "{{count}} ngày",
  aboutXWeeks: "{{count}} tuần",
  xWeeks: "{{count}} tuần",
  aboutXMonths: "{{count}} tháng",
  xMonths: "{{count}} tháng",
  aboutXYears: "{{count}} năm",
  xYears: "{{count}} năm",
  overXYears: "{{count}} năm",
  almostXYears: "{{count}} năm",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "Khoảng " + result;
    } else {
      if (result === "vừa xong") return result;
      return result + " trước";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date | number): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export const nFormatter = (num: number, digits: number) => {
  const lookup = [
    { value: 1e9, symbol: "T" },
    { value: 1e6, symbol: "tr" },
    { value: 1e3, symbol: "k" },
    { value: 1, symbol: "" },
  ];
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup.find((item) => num >= item.value);

  return item ? (num / item.value).toFixed(digits).replace(regex, "$1") : "0";
};

export const fbRegex =
  /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\.\-]*)/;
export const disRegex =
  /(https:\/\/)?(www)?discord.?(gg|com)?\/?(invite)?\/([^\/\?\&\%]*)\S/;
export const vieRegex =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\w ]+$/;

export const groupArray = <T>(array: T[]) =>
  array.reduce(
    (acc, val) => ((acc[val] = (acc[val] || 0) + 1), acc),
    {} as any
  );

export const normalizeText = (text: string) =>
  text.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");

const tsquerySpecialChars = /[()|&:*!]/g;
export const generateSearchPhrase = (searchPhrase: string) =>
  searchPhrase
    .replace(tsquerySpecialChars, " ")
    .trim()
    .split(/\s+/)
    .map((phrase) => `${phrase}:*`)
    .join(" | ");

export function dataUrlToBlob(dataUrl: string) {
  const splittedData = dataUrl.split(",");
  const byteStr = atob(splittedData[1]);
  const typeStr = splittedData[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(byteStr.length);
  const dv = new DataView(buffer);

  for (let i = 0; i < byteStr.length; i++) {
    dv.setUint8(i, byteStr.charCodeAt(i));
  }

  return new Blob([buffer], { type: typeStr });
}

export const getMimeType = (target: any) => {
  try {
    let header = "",
      type;

    const arr = (target as Uint8Array).subarray(0, 4);

    for (let i = 0; i < arr.length; ++i) {
      header += arr[i].toString(16);
    }

    switch (header) {
      case "89504e47":
        type = "image/png";
        break;
      case "47494638":
        type = "image/gif";
        break;
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
      case "ffd8ffe3":
      case "ffd8ffe8":
        type = "image/jpeg";
        break;
      default:
        type = "unknown"; // Or you can use the blob.type as fallback
        break;
    }

    return type;
  } catch (error) {
    return "unknown";
  }
};
