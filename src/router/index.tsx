import { createBrowserRouter } from "react-router-dom";
import Projects from "@/pages/Projects";
import Admin from "@/pages/Admin";
import AdminHome from "@/pages/AdminHome";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import Clients from "@/pages/Clients";
import Services from "@/pages/Services";
import Invoices from "@/pages/Invoices";

export const router = createBrowserRouter([
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
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
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
    path: "/clients",
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    ),
  },
  {
    path: "/services",
    element: (
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invoice",
    element: (
      <ProtectedRoute>
        <Invoices />
      </ProtectedRoute>
    ),
  },
]);