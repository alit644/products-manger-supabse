import { createBrowserRouter } from "react-router";
import RootLayout from "../pages/layout/RootLayout";
import { Register } from "../pages/Auth/Register";
import { Login } from "../pages/Auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Products from "../pages/Products";
import Categories from "../pages/categories/Categories";
import AddCategory from "../pages/categories/AddCategory";
import AddProducts from "../pages/products/AddProducts";
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute children={<RootLayout />} />,
    children: [
      {
        index: true,
        Component: Products,
      },
      {
        path: "/categories",
        element: <ProtectedRoute children={<Categories />} />,
      },
      {
        path: "/add-categories/:editId?",
        element: <ProtectedRoute children={<AddCategory />} />,
      },
      
      {
        path: "/add-products/:editProductId?",
        element: <ProtectedRoute children={<AddProducts />} />,
      },
    ],
  },

  {
    path: "/register",
    element: <ProtectedRoute redirectIfAuthenticated children={<Register />} />,
  },
  {
    path: "/login",
    element: <ProtectedRoute redirectIfAuthenticated children={<Login />} />,
  },
]);
export default router;
