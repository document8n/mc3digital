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
import InvoiceDetails from "@/pages/InvoiceDetails";
import ProjectDetails from "@/pages/ProjectDetails";
import ClientDetails from "@/pages/ClientDetails";
import Tasks from "@/pages/Tasks";
import Users from "@/pages/Users";

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
      <ProtectedRoute requireAdmin>
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute requireAdmin>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute requireAdmin>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute requireAdmin>
        <ProjectDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute requireAdmin>
        <Clients />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients/:id",
    element: (
      <ProtectedRoute requireAdmin>
        <ClientDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/services",
    element: (
      <ProtectedRoute requireAdmin>
        <Services />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invoice",
    element: (
      <ProtectedRoute requireAdmin>
        <Invoices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invoice/:id",
    element: (
      <ProtectedRoute requireAdmin>
        <InvoiceDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute requireAdmin>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute requireAdmin>
        <Users />
      </ProtectedRoute>
    ),
  },
]);