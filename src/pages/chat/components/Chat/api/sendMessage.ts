import { getAndPasteTokens } from "@src/utils/getAndPasteTokens";

const httpHeaders = new Headers({
  "Content-Type": "application/json",
});

export const sendMessage = (contact: string, message: string) => {
  const url = getAndPasteTokens`${"apiUrl"}/waInstance${"idInstance"}/sendMessage/${"idTokenInstance"}`;
  return fetch(url, {
    method: "POST",
    headers: httpHeaders,
    body: JSON.stringify({
      chatId: `${contact}@c.us`,
      message,
      typingTime: "1000",
    }),
  });
};
