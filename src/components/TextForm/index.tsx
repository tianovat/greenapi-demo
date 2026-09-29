import { useCallback, useState } from "react";
import TextInput from "../TextInput";
import Button from "../Button";

const InputField = ({
  field,
  value,
  onChange,
  error,
  blurHandler,
}: {
  field: string;
  value: string;
  onChange: (value: string, field: string) => void;
  error: string;
  blurHandler: (field: string, value: string) => void;
}) => {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value, field);
    },
    [field, onChange],
  );
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      blurHandler(field, e.target.value);
    },
    [field, blurHandler],
  );
  return (
    <TextInput
      onBlur={handleBlur}
      value={value}
      onChange={handleChange}
      placeholder={field}
      error={error}
    />
  );
};

const TextForm = ({
  fields,
  errors,
  onSubmit,
  onFieldChange,
  onFieldBlur,
}: {
  fields: Set<string>;
  errors: Map<string, string>;
  onSubmit: (data: Map<string, string>) => void;
  onFieldChange: (field: string, value: string) => void;
  onFieldBlur: (field: string, value: string) => void;
}) => {
  const [values, setValues] = useState(
    new Map(Array.from(fields).map((field) => [field, ""])),
  );

  const handleFieldChange = useCallback(
    (value: string, field: string) => {
      onFieldChange(field, value);
      setValues((was) => new Map(was.set(field, value)));
    },
    [onFieldChange],
  );

  return (
    <>
      {Array.from(fields).map((field) => (
        <InputField
          key={field}
          blurHandler={onFieldBlur}
          field={field}
          error={errors.get(field) || ""}
          value={values.get(field) || ""}
          onChange={handleFieldChange}
        />
      ))}
      <Button onClick={() => onSubmit(values)} label="Submit" />
    </>
  );
};

export default TextForm;
