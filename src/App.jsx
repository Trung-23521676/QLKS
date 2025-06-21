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

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Tạo một component đơn giản để làm fallback
const AppFallback = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <p>Loading Application...</p>
        </div>
    );
};


function App() {
  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <LoginPage />,
      loader: () => {
        if (isLoggedIn()) {
          return redirect("/");
        }
        return null;
      }
    },
    {
      path: "/",
      element: <Layout />,
      loader: () => {
        if (!isLoggedIn()) {
          return redirect("/Login");
        }
        return null;
      },
      children: [
        {
          index: true,
          element: <DailyOperationPage />,
        },
        {
          path: "Reservations",
          element: <Reservations />,
        },
        {
          path: "Reservations/:bookingId",
          element: <ReservationDetail />,
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
        <RouterProvider 
            router={router} 
            hydrateFallback={<AppFallback />} 
        />
    </ThemeProvider>
  );
}

export default App;