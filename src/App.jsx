// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

function App() {
  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: <Layout />,
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
