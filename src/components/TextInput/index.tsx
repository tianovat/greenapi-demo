import styles from "./styles.module.scss";
const TextInput = ({
  value,
  onChange,
  placeholder,
  error,
  onBlur,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => (
  <>
    <input
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? "text-input-error" : undefined}
    />

    {error && (
      <span id="text-input-error" role="alert" aria-live="polite">
        {error}
      </span>
    )}
  </>
);

export default TextInput;
