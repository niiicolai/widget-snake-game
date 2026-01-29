
import Home from "../documentation/home";
import SnakeGame from "../widget/SnakeGame";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/snake",
    element: <SnakeGame />,
  },
];
