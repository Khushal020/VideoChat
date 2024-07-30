import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Lending from "./pages/Lending";
import Video from "./pages/Video";
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lending />,
  },
  {
    path: "/join/:username",
    element: <Video />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  //<React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  //</React.StrictMode>
);