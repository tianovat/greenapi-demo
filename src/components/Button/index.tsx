import type { ReactElement } from "react";
import styles from "./styles.module.scss";
import { mergeCSS } from "@src/utils/mergeCSS";
const Button = ({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  className?: string;
  label: string | ReactElement;
}) => {
  return (
    <button
      className={mergeCSS(styles.button, className || "")}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
export default Button;
