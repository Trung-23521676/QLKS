import { ThemeProvider } from "./contexts/theme-context"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./routes/layout";
import DailyOperationPage from "./routes/DailyOperation/Page"
import Guests from "./routes/Guests/Page";
import Reservations from "./routes/Reservations/Page"
import Rooms from "./routes/Rooms/Page"
import Service from "./routes/Service/Page"
import Prices from "./routes/Prices/Page"
import Report from "./routes/Report/Page";
import { Header } from "./layouts/header";

function App() {
  const router = createBrowserRouter([
    {
        path:"/",
        element: 
          <Layout/>,
        children: [
          {
            index:true, 
            element: <DailyOperationPage/>,
          },
          {
            path: "Reservations",
            element: <Reservations/>,
          },
          {
            path: "Guests",
            element: <Guests/>
          },
          {
            path: "Rooms",
            element: <Rooms/>
          },
          {
            path: "Service",
            element: <Service/>
          },
          {
            path: "Prices",
            element: <Prices/>
          },
          {
            path: "Report",
            element: <Report/>
          }
        ]
    }
  ]);
  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} /> 
    </ThemeProvider>
  )
}

export default App
