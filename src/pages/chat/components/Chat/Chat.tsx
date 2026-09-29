import TextArea from "@src/components/TextArea";
import styles from "./styles.module.scss";
import React from "react";
import Button from "@src/components/Button";
import type { ChatHitoryBit } from "../../types";
import { mergeCSS } from "@src/utils/mergeCSS";

export const Chat = ({
  contact,
  history,
  sendMessage,
}: {
  contact: string;
  history: ChatHitoryBit[];
  sendMessage: (contact: string, message: string) => void;
}) => {
  const [message, setMessage] = React.useState("");
  return (
    <div className={styles.chat}>
      <div className={styles.header}>Chatting with {contact}</div>
      <div className={styles.history}>
        {history.map((msg, index) => (
          <div
            key={index}
            className={mergeCSS(
              styles.message,
              msg.incoming ? styles.incoming : "",
              !history[index - 1] ||
                history[index - 1].incoming !== msg.incoming
                ? styles.firstInBatch
                : "",
              !history[index + 1] ||
                history[index + 1].incoming !== msg.incoming
                ? styles.lastInBatch
                : "",
            )}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <TextArea
          placeholder="Type a message..."
          value={message}
          onChange={setMessage}
        />
        <Button
          label="Send"
          onClick={() => {
            sendMessage(contact, message);
            setMessage("");
          }}
        />
      </div>
    </div>
  );
};
