// src/App.jsx
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme-context";
import Layout from "./routes/layout";

// Pages
import LoginPage from "./routes/Login/Page";
import DailyOperationPage from "./routes/DailyOperation/Page";
import Guests from "./routes/Guests/Page";
import Reservations from "./routes/Reservations/Page";
import ReservationDetail from "./routes/Reservations/ReservationDetail";
import Rooms from "./routes/Rooms/Page";
import Service from "./routes/Service/Page";
import Prices from "./routes/Prices/Page";
import Report from "./routes/Report/Page";

const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/Login");
  }
  return null;
}
function App() {
  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <LoginPage />,
      loader: () => {
        if (!checkAuth()) {
          return redirect("/Login");
        }
        return null;
      }
    },
    {
      path: "/",
      element: <Layout />,
      loader: checkAuth,
      children: [
        {
          index: true,
          element: <DailyOperationPage />,
        },
        {
          path: "Reservations",
          children: [
            {
              index: true,
              element: <Reservations />,
            },
            {
              path: ":bookingId",
              element: <ReservationDetail />,
            },
          ],
        },
        {
          path: "Guests",
          element: <Guests />,
        },
        {
          path: "Rooms",
          element: <Rooms />,
        },
        {
          path: "Service",
          element: <Service />,
        },
        {
          path: "Prices",
          element: <Prices />,
        },
        {
          path: "Report",
          element: <Report />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
