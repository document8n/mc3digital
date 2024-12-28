import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import Projects from "@/pages/Projects";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import Admin from "./pages/Admin";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/new",
    element: (
      <ProtectedRoute>
        <AddProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id/edit",
    element: (
      <ProtectedRoute>
        <EditProject />
      </ProtectedRoute>
    ),
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