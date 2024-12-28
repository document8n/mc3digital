import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import Projects from "@/pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import Index from "./pages/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/new",
    element: <AddProject />,
  },
  {
    path: "/projects/:id/edit",
    element: <EditProject />,
  },
]);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;