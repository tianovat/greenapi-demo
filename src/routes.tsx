import { createBrowserRouter } from "react-router";
import LoginForm from "@src/pages/login";
import Chat from "@src/pages/chat";
import { redirect } from "react-router";
import { LOCAL_STORAGE_KEY } from "@src/constants";

const authMiddleWare = () => {
  const { idInstance, idTokenInstance, apiUrl } = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || "{}",
  );
  if (!idInstance || !idTokenInstance || !apiUrl) {
    throw redirect("/login");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    middleware: [authMiddleWare],
    element: <Chat />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
]);
export default router;
