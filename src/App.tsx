import { createBrowserRouter } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Projects from "@/pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";

const router = createBrowserRouter([
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
