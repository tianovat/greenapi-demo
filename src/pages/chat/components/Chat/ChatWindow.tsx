import Button from "@src/components/Button";
import TextInput from "@src/components/TextInput";
import React, { useCallback, useEffect } from "react";
import { Chat } from "./Chat";
import { clearNotification, fetchNewMessages } from "./api/fetchMessages";
import { sendMessage as apiSendMessage } from "./api/sendMessage";
import styles from "./styles.module.scss";
import type { ChatHitoryBit } from "../../types";

const DELAY_BETWEEN_FETCH = 2000;
export const ChatWindow = () => {
  const [history, setHistory] = React.useState<Map<string, ChatHitoryBit[]>>(
    new Map(),
  );

  const [chats, setChats] = React.useState<string[]>([]);

  const [selectedContact, setSelectedContact] = React.useState<string | null>(
    null,
  );
  const [contactToAdd, setContactToAdd] = React.useState<string | null>(null);
  const [newContactError, setNewContactError] = React.useState("");
  const validateNewContact = useCallback(() => {
    const contact = contactToAdd?.trim() ?? "";
    const digits = contact.replace(/\D/g, "");
    const isValid =
      /^\+?[0-9().\s-]+$/.test(contact) &&
      digits.length >= 7 &&
      digits.length <= 15;
    setNewContactError(isValid ? "" : "Enter a valid phone number.");
    return isValid;
  }, [contactToAdd]);

  const addNewContact = useCallback(() => {
    if (validateNewContact() && contactToAdd) {
      const contact = contactToAdd.trim().replace(/\D/g, "");
      setChats((prevChats) => [...prevChats, contact]);
      setContactToAdd(null);
      setSelectedContact(contact);
    }
  }, [contactToAdd]);
  const startNewContact = useCallback(() => setContactToAdd(""), []);
  const sendMessage = (contact: string, message: string) =>
    apiSendMessage(contact, message).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setHistory((prev) => {
        const newHistory = new Map(prev);
        const contactHistory = newHistory.get(contact) || [];
        newHistory.set(contact, [
          ...contactHistory,
          { message, incoming: false },
        ]);
        return newHistory;
      });
    });
  useEffect(() => {
    const ac = new AbortController();

    if (selectedContact) {
      const r: () => void = () =>
        fetchNewMessages(ac.signal)
          .then((data) => {
            if (
              data?.body &&
              data.body.typeWebhook === "incomingMessageReceived"
            ) {
              const {
                senderData: { sender },
                messageData: {
                  textMessageData: { textMessage },
                },
              } = data.body;
              const senderPhoneNumber = (sender?.trim() ?? "").replace(
                /\D/g,
                "",
              );
              setHistory((prev) => {
                const newHistory = new Map(prev);
                const contactHistory = newHistory.get(senderPhoneNumber) || [];
                newHistory.set(senderPhoneNumber as string, [
                  ...contactHistory,
                  { message: textMessage, incoming: true },
                ]);
                return newHistory;
              });
            }
            return { data, abortControllerSignal: ac.signal };
          })
          .then((result) => clearNotification(result))
          .then(() => new Promise((r) => setTimeout(r, DELAY_BETWEEN_FETCH)))
          .then(() => r())
          .catch((e) => console.log(e));
      r();
    }
    return () => ac.abort();
  }, [selectedContact]);
  return (
    <div className={styles.chatContainer}>
      <div className={styles.sideBar}>
        {chats.map((chat) => (
          <Button
            key={chat}
            className={styles.chatItem}
            label={chat}
            onClick={() => setSelectedContact(chat)}
          />
        ))}
        <div className={styles.input}>
          {contactToAdd !== null && (
            <TextInput
              value={contactToAdd}
              onBlur={validateNewContact}
              placeholder="Enter contact name..."
              onChange={(value) => {
                setContactToAdd(value);
              }}
              error={newContactError}
            />
          )}
        </div>
        <Button
          onClick={contactToAdd === null ? startNewContact : addNewContact}
          label={contactToAdd === null ? "New Chat" : "Add Contact"}
        />
      </div>

      {selectedContact && (
        <Chat
          sendMessage={sendMessage}
          history={history.get(selectedContact) || []}
          contact={selectedContact}
        />
      )}
    </div>
  );
};
