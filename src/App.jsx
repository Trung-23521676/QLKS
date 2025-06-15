import { ThemeProvider } from "./contexts/theme-context"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./routes/layout";
import DailyOperationPage from "./routes/DailyOperation/Page"
import Guests from "./routes/Guests/Page";
import Reservations from "./routes/Reservations/Page"
function App() {
  const router = createBrowserRouter([
    {
        path:"/",
        element: <Layout/>,
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
            element: <h1 className="title">Rooms</h1>
          },
          {
            path: "Service",
            element: <h1 className="title">Service</h1>
          },
          {/* Add more path here*/}
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
