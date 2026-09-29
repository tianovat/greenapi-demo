import styles from "./styles.module.scss";
const TextArea = ({
  value,
  onChange,
  placeholder,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <textarea
    className={styles.input}
    value={value}
    onChange={(e) => onChange(e.target.value)}

    placeholder={placeholder}
  />
);

export default TextArea;
