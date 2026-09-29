import { LOCAL_STORAGE_KEY } from "@src/constants";

export const getAndPasteTokens = (
  strings: TemplateStringsArray,
  ...keys: string[]
) => {
  const tokens = JSON.parse(
    window.localStorage.getItem(LOCAL_STORAGE_KEY) || "{}",
  );

  return strings.reduce(
    (str, word, i) =>
      `${str}${word}${
        i + 1 === strings.length ? "" : tokens[keys[i] || "default"] || keys[i]
      }`,
    "",
  );
};
