import { getAndPasteTokens } from "@src/utils/getAndPasteTokens";

const httpHeaders = new Headers({
  "Content-Type": "application/json",
});

export const clearNotification = ({
  data,
  abortControllerSignal,
}: {
  data: any;
  abortControllerSignal: AbortSignal;
}) =>
  data
    ? fetch(
        getAndPasteTokens`${"apiUrl"}/waInstance${"idInstance"}/deleteNotification/${"idTokenInstance"}/${data.receiptId}`,
        {
          headers: httpHeaders,
          signal: abortControllerSignal,
          method: "DELETE",
        },
      )
    : null;

export const fetchNewMessages = (abortControllerSignal: AbortSignal) =>
  fetch(
    getAndPasteTokens`${"apiUrl"}/waInstance${"idInstance"}/receiveNotification/${"idTokenInstance"}`,
    { headers: httpHeaders, signal: abortControllerSignal, method: "GET" },
  ).then((response) => response.json());
