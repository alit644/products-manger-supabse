import "./App.css";
import { RouterProvider } from "react-router";
import router from "./router";
import { AuthProvider } from "./context/AuthContext ";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AuthProvider>
          <Toaster />
          <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
