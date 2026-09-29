import { useState } from "react";
import TextForm from "@src/components/TextForm";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router";
import { LOCAL_STORAGE_KEY } from "@src/constants";
import { getAndPasteTokens } from "@src/utils/getAndPasteTokens";
const loginFields = new Set(["idInstance", "idTokenInstance", "apiUrl"]);

const INVALID_CREDENTIALS_ERROR = "Invalid credentials";
const INVAL_URL_ERROR = "Invalid URL or wrong instance ID";
const SERVICE_DOWN_ERROR = "Service is down";

export const LoginForm = () => {
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const navigate = useNavigate();
  const getErrorForField = (data: Map<string, string>, field: string) => {
    switch (field) {
      case "idInstance":
        if (!/^\d+$/.test(data.get(field) || "")) {
          return "idInstance must contain only digits";
        }
        break;
      case "idTokenInstance":
        if (!/^[0-9a-fA-F]+$/.test(data.get(field) || "")) {
          return "idTokenInstance must contain only 0-9 and a-f characters";
        }
        break;
      case "apiUrl":
        if (!/^https:\/\/.+[^\/]$/.test(data.get(field) || "")) {
          return "apiUrl must be a valid HTTPS URL without trailing slash";
        }
        break;
    }
    return "";
  };
  const validateFields = (data: Map<string, string>) => {
    let found = false;
    ["idInstance", "idTokenInstance", "apiUrl"].forEach((field) => {
      const error = getErrorForField(data, field);
      found = found || !!error;
      setErrors((prev) => new Map(prev.set(field, error)));
    });

    return !found;
  };

  const fieldChangeHandler = (field: string, value: string) => {
    let toClear = [field];
    if (field in ["idInstance", "idTokenInstance"]) {
      toClear = ["idInstance", "idTokenInstance"];
    }
    setErrors((prev) => {
      toClear.forEach((f) =>
        prev.set(
          f,
          (prev.get(f) || "") in
            [INVAL_URL_ERROR, SERVICE_DOWN_ERROR, INVALID_CREDENTIALS_ERROR]
            ? ""
            : prev.get(f)
              ? getErrorForField(new Map([[f, value]]), f)
              : "",
        ),
      );
      return prev;
    });
  };

  const submitHandler = (data: Map<string, string>) => {
    const { idInstance, idTokenInstance, apiUrl } = Object.fromEntries(data);

    if (validateFields(data)) {
      fetch(
        getAndPasteTokens`${"apiUrl"}/waInstance${"idInstance"}/getStateInstance/${"idTokenInstance"}`,
      ).then((response) => {
        if (response.ok) {
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              idInstance,
              idTokenInstance,
              apiUrl,
            }),
          );
          navigate("/");
        } else {
          if (response.status === 401) {
            setErrors(
              (prev) =>
                new Map(
                  prev
                    .set("idInstance", INVALID_CREDENTIALS_ERROR)
                    .set("idTokenInstance", INVALID_CREDENTIALS_ERROR),
                ),
            );
          } else if (response.status === 404) {
            setErrors(
              (prev) =>
                new Map(
                  prev
                    .set("apiUrl", INVAL_URL_ERROR)
                    .set("idInstance", INVAL_URL_ERROR),
                ),
            );
          } else if (response.status === 500) {
            setErrors(
              (prev) => new Map(prev.set("apiUrl", SERVICE_DOWN_ERROR)),
            );
          } else {
            setErrors(
              (prev) =>
                new Map(
                  prev.set(
                    "apiUrl",
                    `Unexpected error: ${response.statusText}`,
                  ),
                ),
            );
          }
        }
      });
    }
  };
  return (
    <div className={styles.formContainer}>
      <TextForm
        onFieldChange={fieldChangeHandler}
        onFieldBlur={(field, value) => {
          setErrors(
            (prev) =>
              new Map(
                prev.set(
                  field,
                  getErrorForField(new Map([[field, value]]), field),
                ),
              ),
          );
        }}
        errors={errors}
        fields={loginFields}
        onSubmit={submitHandler}
      />
    </div>
  );
};
