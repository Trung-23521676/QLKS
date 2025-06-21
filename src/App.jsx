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

// Tạo một hàm đơn giản chỉ để kiểm tra xem có token hay không (trả về true/false)
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // Dấu !! sẽ chuyển đổi giá trị token (hoặc null) thành boolean
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <LoginPage />,
      loader: () => {
        // Nếu ĐÃ đăng nhập, chuyển hướng ra khỏi trang Login
        if (isLoggedIn()) {
          return redirect("/");
        }
        // Nếu chưa đăng nhập, không làm gì cả, cho phép   hiển thị trang Login
        return null;
      }
    },
    {
      path: "/",
      element: <Layout />,
      // Nếu CHƯA đăng nhập, chuyển hướng đến trang Login
      loader: () => {
        if (!isLoggedIn()) {
          return redirect("/Login");
        }
        // Nếu đã đăng nhập, cho phép hiển thị trang chính
        return null;
      },
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